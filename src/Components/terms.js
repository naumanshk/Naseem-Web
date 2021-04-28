import React, {Component} from 'react';
import '../App.css';
import logo from '../Images/naseemlogo.png'
import { BrowserRouter as Redirect, Link } from "react-router-dom";

class terms extends Component {
    constructor(){
        super();
        this.state = {

        }
    }

    render(){
        return (
            <div>
            <div className="about-navbar">
                    <img className="about-logo" src={logo}></img>
                    <div className="app-bar">
                    <div className="flex">
                        <a href="/about"><h3 className="grey about-btn" >Home</h3></a>
                        <a href="/about#about"><h3 className="grey about-btn" >About</h3></a>
                        <a href="/about#products"><h3 className="grey about-btn" >Our Products</h3></a>
                        <a href="/about#team"><h3 className="grey about-btn" >Team</h3></a>
                        <a href="/terms&conditions"><h3 className="grey about-btn" >Terms & Conditions</h3></a>

                    </div>
                    </div>
            </div>

            <div className="terms" id="terms&conditions">
                    <h1 className="regular about-grey center">Terms and Conditions</h1>
                    <p>Please read these terms and conditions carefully before using Our Service.</p>

                    <h3>Interpretation and Definitions</h3>
                    <h4>Interpretation</h4>
                    <p>The words of which the initial letter is capitalized have meanings defined under the following conditions.</p>

                    <p>The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

                    <h4>Definitions</h4>
                    <p>For the purposes of these Terms and Conditions:</p>

                    <p>Affiliate means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.
                    <br/>Company (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Naseem Education, Office No 1206 NSTP NUST H-12 Islamabad.
                    <br/>Country refers to: Pakistan
                    <br/>Service refers to the Website.
                    <br/>Terms and Conditions (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service. This Terms and Conditions agreement as been created with the help of Terms and Conditions Generator.
                    <br/>Third-party Social Media Service means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.
                    <br/>Website refers to Naseem Education, accessible from <a href="https://naseem.education">https://naseem.education</a>
                    <br/>You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
                    <h3>Acknowledgement</h3>
                    <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>

                    <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>

                    <p>By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>

                    <p>Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.</p>

                    <p>The ownership of all the content in Naseem’s products relies either with Naseem Education or the third parties whose APIs are being used. </p>

                    <p>If you want to share Any of the content on the app, you need seek permission from Naseem Education by emailing to the below email address.</p>

                    <p>We will not share any of your data with any third without seeking your permission.</p>

                    <p>We may use your data to improve your experience on the app.</p>

                    <p>If you have any concerns about your data you can contact us directly on the email below. </p>

                    <p>hello@naseem.education</p>
                </div>
            
            </div>
        )
    }
}

export default terms;