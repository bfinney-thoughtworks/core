import React, {Component} from 'react';
import MembershipType from './MembershipType.jsx';
import Details from './Details.jsx';
import Payment from './Payment.jsx';
import ConfirmDetails from './ConfirmDetails.jsx';
import ProgressBar from './ProgressBar.jsx';
import Finished from './Finished.jsx';
import $ from 'jquery';

export default class NewMemberForm extends Component {
    constructor(props) {
        super(props);
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.setMembershipType = this.setMembershipType.bind(this);
        this.postAndContinue = this.postAndContinue.bind(this);
        this.saveAndContinue = this.saveAndContinue.bind(this);
        this.getForm = this.getForm.bind(this);
        this.state = { step: (this.props.initialState === undefined ? 1 : this.props.initialState) };
        this.formValues = {
                            isEnrolled: '',
                            residentialStatus: '',
                            isMemberOfOtherParty: '',
                            eligibility: '',
                            firstName: '',
                            lastName: '',
                            dateOfBirth: '',
                            gender: '',
                            email: '',
                            primaryPhoneNumber: '',
                            secondaryPhoneNumber: '',
                            residentialAddress: {
                                address: '',
                                suburb: '',
                                country: '',
                                state: '',
                                postcode: ''
                            },
                            postalAddress: {
                                address: '',
                                suburb: '',
                                country: '',
                                state: '',
                                postcode: ''
                            }
                        };

    }

    nextStep() {
        this.setState( { step: this.state.step + 1  } )
    }

    previousStep() {
        this.setState( { step: this.state.step - 1  } )
    }

    setMembershipType(type) {
      this.setState({membershipType: type});
      this.nextStep();
    }

    saveAndContinue(fieldValues) {
      this.formValues = fieldValues;
      this.nextStep();
    }

    postAndContinue(fieldValues) {
      $.ajax({
          type: 'POST',
          url: '/members',
          data: fieldValues,
          success: this.nextStep
      });
    }

    getForm() {
      switch(this.state.step) {
          case 1:
              return <MembershipType nextStep={this.setMembershipType}
                                     formValues={this.formValues} />;
          case 2:
              return <Details formValues={this.formValues}
                              saveAndContinue={this.saveAndContinue}
                              previousStep={this.previousStep}
                              membershipType={this.state.membershipType} />;
          case 3:
              return <ConfirmDetails formValues={this.formValues}
                                    postAndContinue={this.postAndContinue}
                                    previousStep={this.previousStep} />;
          case 4:
              return <Payment email={this.formValues.email}
                              previousStep={this.previousStep}
                              nextStep={this.nextStep} />;
          case 5:
              return <Finished email={this.formValues.email}
                                nextStep={this.nextStep} />;
      };
    }

    render() {
        return (
          <div>
            <ProgressBar progress={this.state.step} />
            {this.getForm()}
          </div>
        );
    }
}
