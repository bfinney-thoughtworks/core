'use strict';

const Q = require('q'),
    models = require('../models'),
    logger = require('../lib/logger'),
    stripeController = require('../controllers/stripeController'),
    moment = require('moment'),
    Invoice = models.Invoice;

var stripe = require("stripe")(stripeController.getSecretKey());

var createInvoice = (newInvoice) => {
  return Q({
    memberEmail: newInvoice.memberEmail,
    totalAmountInCents: newInvoice.totalAmount * 100,
    paymentDate: moment().format('L'),
    paymentType: newInvoice.paymentType,
    reference: ''
  })
    .then(Invoice.create.bind(Invoice))
    .then(logger.logNewInvoiceEvent(newInvoice))
    .catch((error) => {
        return Q.reject(error);
    });
};

var chargeCard = (stripeToken, totalAmount) => {
  return stripe.charges.create({
        amount: parseFloat(totalAmount) * 100,
        currency: "aud",
        source: stripeToken,
        description: "Example charge"
      })
      .then(logger.logNewChargeEvent(stripeToken));
};

module.exports = {
    createInvoice: createInvoice,
    chargeCard: chargeCard
};