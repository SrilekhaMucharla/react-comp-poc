import {
    HDAccordionRefactor, HDLabelRefactor,
    HDOverlayPopup,
    HDTextInputRefactor
} from 'hastings-components';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Row, Col} from 'react-bootstrap';
import {connect} from 'react-redux';
import * as messages from './HDPrivacyPolicy.messages';

const HDPrivacyPolicy = ({urlText}) => {
        const [open, setOpen] = useState(false);

        const questions = [{
            header: 'Introduction',
            content: [

                <div>
                    <p>Your privacy is important and we go to great lengths to protect it. This privacy notice tells you about
                        the personal data we hold about you and explains how we collect, use and share your details. It also
                        tells you about your rights under data protection laws.</p>
                    <p>Some of the personal information we collect is for vehicle insurance only, so you won’t be asked for all
                        of the information detailed here if you’re applying for home insurance.</p>
                </div>
            ]
        }, {
            header: 'About Hastings Group Holdings limited',
            content: [
                <p>Here at Hastings Group Holdings Ltd, we'll always treat your personal data with respect and our products
                    and services are designed with your privacy in mind. Hastings Group Holdings limited consists of the
                    data controllers Hastings Insurance Services Ltd and Advantage Insurance Company Ltd. View the <a
                        href="http://www.advantage.com.gi/index.php?id=14" target="_blank" rel="noopener noreferrer">Advantage
                        privacy notice.</a>.</p>
            ]
        }, {
            header: '1. About Hastings Insurance Services Ltd.',
            content: [
                <p>This privacy notice relates to Hastings Insurance Services Limited (also referred to as 'Hastings
                    Direct', 'we', 'us' or 'our') and our registered office is at Conquest House, Collington Avenue,
                    Bexhill-on-Sea, East Sussex, TN39 3LW. Our ICO registration number is Z7677970.</p>
            ]
        }, {
            header: '2. What we mean by personal information',
            content: [
                <div>
                    <p>This is information relating to you as an individual that's linked to your name or any other way you can
                        be identified, such as your driving licence number or your insurance policy number.</p>
                    <p>Certain types of personal information are considered to be <span class="u-text-bold">special categories of information</span>,
                        due to their more sensitive nature. Sometimes we'll ask for (or obtain) special categories of
                        information because it's relevant to your insurance policy or claim. For example, to assess risk
                        correctly, we'll ask you about previous motoring convictions. This privacy notice highlights where we're
                        likely to obtain special categories of information and the grounds on which we process this data. We'll
                        only process special categories of information if they're relevant e.g. information about your health
                        and criminal convictions.</p>
                </div>
            ]
        }, {
            header: '3. How we use your personal information',
            content: [
                <div>
                    <p>The personal information we collect will depend on our relationship with you. We've included a number of
                        sections below – simply read those which most apply to your relationship with us.</p>
                    <p class="u-text-bold">If you give us personal information about other people you must make sure they are
                        aware of this privacy policy. You must also get their consent where we've indicated we'll need it.</p>

                    <h5>3.1 If you've taken out a quote, have a policy with us, or are responsible for paying for a policy</h5>

                    <p>This section shows what personal information we collect and use about you if you're:</p>

                    <ul class="a-list a-list--secondary">
                        <li>A prospective customer and have submitted your personal information so we can provide you with an insurance quote<sup>*</sup></li>
                        <li>Somebody named on a quote<sup>*</sup></li>
                        <li>An existing customer, either as the policy holder or covered by the policy</li>
                        <li>Responsible for paying for someone else's policy.</li>
                    </ul>

                    <p>* Both of these include any quotes obtained from price comparison websites (PCWs). Please note that when you use a PCW to obtain a quote, not only do they retain your personal information, they also pass that information to us when you select the Hastings price. In many cases, the PCW may also automatically offer you a new quotation on the anniversary of the existing one (see their privacy notice for more details).</p>

                    <h5>3.1.1 The personal information we'll collect and where we'll collect it from</h5>

                    <p>The following information will be collected from you (or anyone applying for a policy on your behalf) online or by phone if relevant to the insurance policy:</p>

                    <ul class="a-list a-list--secondary">
                        <li><span class="u-text-bold">Individual details:</span> Your name, address, former address(es), contact details (e.g. email/telephone), gender, marital status, date of birth, length of time as a UK resident.</li>
                        <li><span class="u-text-bold">Employment information:</span> Your job title and the nature of the industry you work in.</li>
                        <li><span class="u-text-bold">Identification details:</span> For example, your driving licence number.</li>
                        <li><span class="u-text-bold">Previous and current claims:</span> Any previous insurance policies you've held and claims made against those policies.</li>
                        <li><span class="u-text-bold">Other risk details:</span> Details about the car to be insured, along with these <span class="u-text-bold">special categories of information</span> relating to each driver:

                            <ul class="a-list a-list--secondary">
                                <li><span class="u-text-bold">Health data:</span> Physical or mental health information relevant to the insurance application, e.g. DVLA notifiable conditions.</li>
                                <li><span class="u-text-bold">Criminal convictions:</span> Any which are unspent under the Rehabilitation of Offenders Act, including any motoring and non-motoring offences/alleged offences committed or any court sentences you're subject to.</li>
                            </ul>

                        </li>
                        <li><span class="u-text-bold">Marketing preferences:</span> This includes whether you've given your consent to receive marketing information.</li>
                        <li><span class="u-text-bold">Website use, app use including cookies and use of our web chat service:</span> See section 4 below for details.</li>
                        <li><span class="u-text-bold">Other information:</span> This will be captured during recordings of any telephone calls, other contact with us or if you make a complaint. This may include <span class="u-text-bold">special categories of information</span> you provide when talking with us.</li>
                        <li><span class="u-text-bold">Financial information:</span> Bank and payment information.</li>
                        <li><span class="u-text-bold">Driving information:</span>If the insurance policy chosen allows for the tracking of your driving as part of the policy, the device used collects a wide range of driving data, when the car is both moving and stationary, such as:

                            <ul class="a-list a-list--secondary">
                                <li><span class="u-text-bold">Date/time:</span> This helps us to understand what time of day the car is driven.</li>
                                <li><span class="u-text-bold">Locational data:</span> To understand what roads are driven and the location of the vehicle when it's moving or stationary including latitude, longitude, heading and direction. It also supports the theft tracking service.</li>
                                <li><span class="u-text-bold">Speed, acceleration, cornering and braking data:</span> To understand how smooth the driving style is.</li>
                                <li><span class="u-text-bold">Accident detection:</span> This helps us to operate the accident alert service and to understand the circumstances relating to any accident.</li>
                                <li><span class="u-text-bold">Mobile phone use:</span> If the driving data is collected by an app on your mobile, the app will record that the mobile is being used in another way, but it will not record any of the specific data or details of the other use.</li>
                            </ul>

                        </li>
                        <li><span class="u-text-bold">Additional identification details:</span> In some situations, we may ask you for further information and/or copies of documents so that we can validate your identity. This may include details about your residency, marital status, address, driving licence details or details of your car. It could also include special categories of information (e.g. driving licence, convictions etc.).</li>
                        <li><span class="u-text-bold">Claims information:</span> This will be in relation to any incident or alleged incident involving the insured car. This includes <span class="u-text-bold">special categories of information</span> you give us when talking or writing to us about your claim (we'll only process this to the extent necessary in connection with your claim or in connection with legal proceedings).</li>
                    </ul>

                    <p>We use external sources to supplement and verify the information above. We also use them to provide the following new information, to help us understand you as a customer:</p>

                    <ul class="a-list a-list--secondary">
                        <li><span class="u-text-bold">Credit and anti-fraud data:</span> Credit history and credit score (for example, before we offer the option of monthly payments by direct debit, we will run a credit check). We also collect sanctions and criminal offences, bankruptcy orders, individual voluntary arrangements (IVAs) or county court judgments, and information received from various anti-fraud databases. Some of this information (e.g. criminal offences) may include <span class="u-text-bold">special categories of information</span> about you.</li>
                        <li><span class="u-text-bold">Demographic data:</span> Lifestyle indicators such as income, education and the size of your household.</li>
                        <li><span class="u-text-bold">Open source data:</span> Different types of data which is in the public domain. When proportionate to do so, this will include social media about you or the circumstances of any accident.</li>
                        <li><span class="u-text-bold">Photo or video data:</span> Includes photos taken of the damage or footage recorded relating to a claim (including accident circumstances and interviews).</li>
                        <li><span class="u-text-bold">Claims assessment reports:</span> This could be from engineers, medical experts, claims investigators and, in limited circumstances, private investigators. Some assessment reports may include <span class="u-text-bold">special categories of information</span> about you.</li>
                        <li><span class="u-text-bold">Other Hastings Group Companies:</span> We may also use information that you provided to other Hastings Group companies.</li>
                    </ul>

                    <p>Before we provide services, goods or financing to you, we undertake checks for the purposes of preventing fraud, money laundering and to verify your identity. We use external sources to supplement and verify the information above, and to provide the following new information:</p>

                    <ul class="a-list a-list--secondary">
                        <li><span class="u-text-bold">Credit and anti-fraud data:</span> Credit history, credit score, sanctions and criminal offences, bankruptcy orders, individual voluntary arrangements (IVAs) or county court judgements, and information received from various anti-fraud databases. Some of this information (e.g. criminal offences) may include <span class="u-text-bold">special categories of information</span> relating to you.</li>
                        <li><span class="u-text-bold">Demographic data:</span> Lifestyle indicators such as income, education, and size of your household.</li>
                        <li><span class="u-text-bold">Open source data:</span> Other information about you that is publicly available.</li>
                        <li><span class="u-text-bold">Driving data:</span> In relation to previously held policies with any insurer.</li>
                    </ul>

                    <p>The external sources that provide us with information about you include:</p>

                    <ul class="a-list a-list--secondary">
                        <li>The person applying for the policy (where you're an individual named under a quote) or anyone authorised to act on your or their behalf.</li>
                        <li>Other insurance companies.</li>
                        <li>Other third parties involved in the insurance application process, such as the price comparison website used or other insurers.</li>
                        <li>Credit reference agencies.</li>
                        <li>Providers of demographic data and vehicle data.</li>
                        <li>Financial crime detection agencies and insurance industry financial crime databases (such as for fraud prevention and checking against international sanctions) including the Claims and Underwriting Exchange (known as 'CUE'), CIFAS and the Insurance Fraud Bureau (IFB). The IFB website can be accessed at <a href="https://www.insurancefraudbureau.org" target="_blank" rel="noopener, noreferrer">www.insurancefraudbureau.org</a>.</li>
                        <li>Insurance industry bodies and databases (including but not limited to the Motor Insurance Anti-Fraud and Theft register and the No Claims History database).</li>
                        <li>Other Hastings Group companies</li>
                        <li>In the event of a claim:

                            <ul class="a-list a-list--secondary">
                                <li>Other parties involved in any claim, including passengers, witnesses and any third party claimants or their insurers.</li>
                                <li>Third party suppliers who help us provide services when a claim is made (such as external claims handlers, our repair network, medical experts, claims investigators and private investigators).</li>
                            </ul>

                        </li>
                        <li>Third party suppliers we use to help us to carry out our everyday business activities including IT suppliers, actuaries, auditors, lawyers, debt collection agencies, document management providers, outsourced business process management providers, our subcontractors and tax advisors.</li>
                        <li>Government agencies and bodies such as the DVLA or regulators where required (e.g. the Financial Conduct Authority).</li>
                        <li>Publicly available sources (e.g. the electoral roll, court judgments, insolvency registers, internet search engines, news articles) and sources licensed under the Open Government Licence v 3.0.</li>
                        <li>Other third parties involved in your insurance policy or a claim (e.g. other insurers).</li>
                        <li>Our reinsurers.</li>
                    </ul>

                    <p>Under our User Agreement with the Motor Insurance Bureau, our individual customer representatives don't have access to the data returned by a driving licence number search (DLN) and won't be able to discuss issues relating to your DLN with you. In these cases, we suggest you check the information associated with your DLN is correct at <a href="https://www.gov.uk/view-driving-licence" target="_blank" rel="noopener noreferrer">www.gov.uk/view-driving-licence</a>.</p>
                    <p>Also, if you provide us with a DVLA check code for a named driver on your policy, it is your responsibility to ensure that you have their permission.</p>

                    <h5>3.1.2 What we use your personal information for</h5>
                    <p>We may process your personal information for a number of different purposes. We must have a legal ground for each purpose and we'll rely on the following grounds:</p>

                    <ul class="a-list a-list--secondary">
                        <li>We need your personal information because it is necessary to enter into or perform a contract (e.g. you request a quote with a view to entering into an insurance contract).</li>
                        <li>We have a legitimate interest to use your personal information. For example, to keep a record of the decisions we make when different types of applications are made (e.g. if you request a quotation or changing details of a policy), keep business records, carry out strategic business analysis, review our business planning, or develop and improve our products and services. When using your personal information in this way, we'll always consider your rights and interests.</li>
                        <li>We have a legal or regulatory obligation to use your personal information (e.g. to meet the record-keeping requirements of our regulators).</li>
                    </ul>

                    <p>We must have an additional legal ground for processing <span class="u-text-bold">special categories of information</span>. We'll rely on the following:</p>

                    <ul class="a-list a-list--secondary">
                        <li>It's in the substantial public interest and it's necessary for an insurance purpose (e.g. assessing your insurance application and managing claims) or to prevent and detect an unlawful act (e.g. fraud).</li>
                        <li>To establish, exercise or defend legal claims (e.g. when legal proceedings are being brought or threatened against us or we want to bring a legal claim ourselves).</li>
                        <li>Where we have asked for your explicit consent (e.g. if you are unable to pay a debt due to a medical condition or illness).</li>
                    </ul>

                    <p>See the table below. Where we've used the acronym <span class="u-text-bold">PH</span> this refers to the policyholder of any insurance product. In the case of vehicle insurance, <span class="u-text-bold">ND</span> refers to any named driver on the quote and <span class="u-text-bold">TPP</span> to a person who is just responsible for paying for the policy.</p>

                    <div class="table-responsive">
                        <table class="table table-bordered table-custom-striped">
                            <thead>
                            <tr>
                                <th>Type of processing</th>
                                <th>Grounds for using personal information</th>
                                <th>Grounds for special categories</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td class="u-text-bold">To assess your insurance application and provide a quote (or a quote you're named in)</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li><span class="u-text-bold">PH</span> – To enter into or perform a contract</li>
                                        <li><span class="u-text-bold">ND</span> – We have a legitimate interest (to assess the insurance application and provide a quote)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>It's necessary for an insurance purpose</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To verify your identity or carry out fraud, credit and anti-money laundering checks for an insurance application or to provide a quote (or a quote you're named in)</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li><span class="u-text-bold">PH</span> – To enter into or perform a contract</li>
                                        <li><span class="u-text-bold">ND</span> – We have a legitimate interest (to carry out appropriate fraud/credit checks)</li>
                                        <li><span class="u-text-bold">PH</span> – To enter into or perform a contract</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>It's necessary for an insurance purpose</li>
                                        <li>It's in the substantial public interest to prevent or detect unlawful acts</li>
                                        <li>To establish, exercise or defend legal rights</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To set up your insurance policy (or a policy you're covered on)</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li><span class="u-text-bold">PH</span> – To enter into or perform a contract</li>
                                        <li><span class="u-text-bold">ND</span> – We have a legitimate interest (to set up and validate insurance policies)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>It's necessary for an insurance purpose</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To set up a loan or monthly payment plan</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li><span class="u-text-bold">PH</span> – To enter into or perform a contract</li>
                                        <li><span class="u-text-bold">TOP</span> – To enter into or perform a contract</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We won't process your special categories of information for this purpose</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To communicate with you to manage queries and resolve any complaints you might have</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>To enter into or perform a contract</li>
                                        <li>We have a legitimate interest (to send you communications, record and handle complaints)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>It's necessary for an insurance purpose</li>
                                        <li>To establish, exercise or defend legal rights</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To comply with our legal or regulatory obligations</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legal or regulatory obligation</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>It's necessary for an insurance purpose</li>
                                        <li>To establish, exercise or defend legal rights</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To make sure we consider any customers who may be in a vulnerable circumstance</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to ensure a consistent service to all of our customers and that all customers are treated equally)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>It's necessary for an insurance purpose</li>
                                        <li>Explicit consent</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To manage any claims you make under your insurance policy (or a policy you're covered on)</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li><span class="u-text-bold">PH</span> – To enter into or perform a contract</li>
                                        <li><span class="u-text-bold">ND</span> – We have a legitimate interest (to pay claims and manage the claims process)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>It's necessary for an insurance purpose</li>
                                        <li>To establish, exercise or defend legal rights</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">Using driving data to monitor driving practices</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li><span class="u-text-bold">PH</span> – To enter into or perform a contract</li>
                                        <li><span class="u-text-bold">ND</span> – We have a legitimate interest (to monitor the driving style of drivers insured by us)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We won't process your special categories of information for this purpose</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To assist in risk modelling and renewal pricing of products</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to develop and improve our products and services)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>It's necessary for an insurance purpose</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To prevent and investigate fraud on an ongoing basis</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to prevent and detect fraud and other financial crime)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>It's in the substantial public interest to prevent or detect unlawful acts (where we suspect fraud)</li>
                                        <li>To establish, exercise or defend legal rights</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">For debt collection purposes</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>To enter into or perform a contract</li>
                                        <li>We have a legitimate interest (for example, to recover a debt)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>Explicit consent</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To provide improved quality, training and security (e.g. through recorded or monitored phone calls to/from us, or customer satisfaction surveys)</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to develop and improve our products and services)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We won't process your special categories of information for this purpose</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">Managing our business operations (e.g. keeping accounting records, analysing financial results, meeting audit requirements, receiving professional advice, and holding our own insurance)</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to carry out business operations and activities that are necessary for the everyday running of a business)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We won't process your special categories of information for this purpose</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">For insurance administration purposes including trend analysis, actuarial work, pricing analysis, analysis of customer experience, planning service delivery, risk assessment, and costs and charges</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to develop and improve our products and services)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We won't process your special categories of information for this purpose</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To send you marketing materials about our products and services (with your permission)</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>Consent</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We won't process your special categories of information for this purpose</li>
                                    </ul>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <h5>3.1.3 Who we'll share your personal information with</h5>
                    <p>We'll share personal information within Hastings Group Holdings and/or the following third parties, for the purposes laid out in the table above:</p>

                    <ul class="a-list a-list--secondary">
                        <li>Credit reference agencies, including debt collection agencies when required. More information about CRAs and how they use personal information is available at https://www.TransUnion.co.uk/crain, https://www.equifax.co.uk/crain and https://www.experian.co.uk/crain</li>
                        <li>Finance institutions to allow us to carry out a financial transaction for your policy. For example, in order to process payments from your debit or credit card, we share your personal, card and transaction details with our payment processing provider, Worldpay. Worldpay acts as a controller of your data under the terms of its own <a href="https://www.worldpay.com/en-gb/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy notice</a> which can be found on its corporate website.</li>
                        <li>Other insurers and/or brokers who support our products (e.g. our motor legal protection provider or providers of any optional extras bought alongside your policy) or are involved in a claim.</li>
                        <li>Our providers who need your information to provide a service to you (e.g. claims services, our repair network, optional extra products, repair quotes etc.).</li>
                        <li>Providers of demographic data and vehicle data.</li>
                        <li>Financial crime detection agencies and insurance industry financial crime databases (such as for fraud prevention and checking against international sanctions) including the Claims and Underwriting Exchange (known as 'CUE'), CIFAS and the Insurance Fraud Bureau (IFB). The IFB website can be accessed at <a href="https://www.insurancefraudbureau.org/" target="_blank" rel="noopener, noreferrer">www.insurancefraudbureau.org</a>.</li>
                        <li>Insurance industry bodies and databases (including but not limited to the Motor Insurance Anti-Fraud and Theft register and the No Claims History database).
                        </li><li>Government agencies and bodies such as the DVLA, Department for Work &amp; Pensions, or regulators (e.g. Financial Conduct Authority).</li>
                        <li>Other third parties involved in the insurance application process such as the price comparison website used or other insurers.</li>
                        <li>Third party suppliers we use to help us carry out our everyday business activities including IT suppliers, actuaries, auditors, lawyers, debt collection agencies, document management providers, outsourced business process management providers, our subcontractors and tax advisors.</li>
                        <li>The police and other crime prevention and detection agencies. We and fraud prevention agencies may enable law enforcement agencies to access and use your personal data to detect, investigate and prevent crime.</li>
                        <li>Selected third parties in connection with any sale, transfer or disposal of our business.</li>
                        <li>Where you've bought a policy using an introductory cash back incentive code or link or claim a reward through one of the price comparison websites, the relevant incentive provider.</li>
                    </ul>

                    <p><span class="u-text-bold">Sharing of motor vehicle driving data:</span> Once you've taken a driving policy where collecting your driving behaviour is part of the contract and you've activated the device, it will record and provide us with data about your driving style. It will collect a wide range of driving data such as date, time, location, speed, acceleration, cornering and braking. If the device is an app on a mobile it will also record mobile phone use. It won't record details about the actual use but the fact that it has been used.</p>
                    <p>For these types of products we'll share driving data only in the following circumstances:</p>

                    <ul class="a-list a-list--secondary">
                        <li>With third parties where we need to do so to manage the insurance policy or any claims (e.g. with our accident recovery partners if the car needs to be recovered following an accident).</li>
                        <li>Where your monitoring device was supplied by a third party, the monitored data is processed by them, as well as our Group.</li>
                        <li>With insurance industry bodies and databases (including, but not limited to, the Motor Insurance Anti-Fraud and Theft register and the No Claims History database).</li>
                        <li>Between departments within the company and/or group. For example:

                            <ul class="a-list a-list--secondary">
                                <li>To help reduce fraud, by checking if another person is making a false claim against the driver, the driver is making a false claim against someone else or for debt recovery.</li>
                                <li>To encourage safer driving by examining how various groups drive and at what time of day the most incidents happen.</li>
                                <li>To help calculate tailored renewal premiums for policyholders.</li>
                                <li>To research and refine techniques for analysing driving data, including looking at road safety issues such as analysis of certain roads to identify the risks they represent.</li>
                            </ul>

                        </li>
                        <li>Analytics suppliers use the data for research (e.g. to improve road safety). Any information we share is made anonymous and does not contain any information classed as personal data under the data protection regulations. This means none of the data can be linked to the policyholder.</li>
                        <li>Law enforcement and governing agencies - where justified and proportionate within data protection laws/</li>
                    </ul>

                    <h5>3.2 If you've been involved in a vehicle accident with one of our customers</h5>

                    <h5>3.2.1 What personal information we'll collect and where we'll collect it from</h5>
                    <p>We'll collect the following personal information from you, or from our customer if details were exchanged at the time of the accident, where relevant to your claim:</p>

                    <ul class="a-list a-list--secondary">
                        <li><span class="u-text-bold">Individual details:</span> Your name, address, contact details (e.g. email/telephone), gender, marital status, date of birth, nationality.</li>
                        <li><span class="u-text-bold">Employment information:</span> Your job title and the nature of the industry you work in.</li>
                        <li><span class="u-text-bold">Identification details:</span> Your national insurance number, passport information, driving licence number.</li>
                        <li><span class="u-text-bold">Previous and current claims:</span> Any previous insurance policies you have held and claims made against those policies.</li>
                        <li><span class="u-text-bold">Information which may be relevant to your claim:</span> This includes the name and contact details of your insurer, details about your car/property and details about your claim (including any statements, photos/video footage, claims assessment reports and driving data). This information may include the following <span class="u-text-bold">special categories of information</span> relating to you:

                            <ul class="a-list a-list--secondary">
                                <li><span class="u-text-bold">Health data:</span> Physical or mental health information which are relevant to your claim (e.g. where you've been injured in a motor accident and the driver is insured through us). This may include medical records relating to any injuries.</li>
                                <li><span class="u-text-bold">Criminal convictions:</span> Any which are unspent under the Rehabilitation of Offenders Act. This includes motoring and non-motoring offences/alleged offences you have committed or any court sentences you're subject to.</li>
                            </ul>

                        </li>
                        <li><span class="u-text-bold">Financial information:</span> Bank and payment information.</li>
                        <li><span class="u-text-bold">Website use, including cookies and use of our web chat service:</span> See section 4 below for details.</li>
                        <li><span class="u-text-bold">Other information:</span> Any information that we capture during recordings of our telephone calls in correspondence with us or if you make a complaint. This may include <span class="u-text-bold">special categories of information</span> you volunteer when communicating with us. We'll only process such information to the extent necessary in connection with the claim or in connection with legal proceedings. Any further processing will only be with your explicit consent.</li>
                    </ul>

                    <p>We use external sources to supplement and verify the information above and also to provide the following new information:</p>

                    <ul class="a-list a-list--secondary">
                        <li><span class="u-text-bold">Individual details:</span> Your name, address, contact details (e.g. email/telephone), date of birth and nationality.</li>
                        <li><span class="u-text-bold">Credit and anti-fraud data:</span> Credit history, credit score, sanctions and criminal offences, bankruptcy orders, individual voluntary arrangements (IVAs) or county court judgments, and information received from various anti-fraud databases. Some of this information (e.g. criminal offences) may include <span class="u-text-bold">special categories of information</span> relating to you.</li>
                        <li><span class="u-text-bold">Demographic data:</span> Lifestyle indicators such as income, education and size of your household.</li>
                        <li><span class="u-text-bold">Open source data:</span> Other information which is publicly available (including social media), which relates to you or the circumstances of any accident.</li>
                    </ul>

                    <p>The external sources that provide us with information about you include:</p>

                    <ul class="a-list a-list--secondary">
                        <li>Other parties involved in your claim, including any named individual insured through us, passengers, witnesses or other third party claimants.</li>
                        <li>Other insurers.</li>
                        <li>Other Hastings Group Holdings limited companies.</li>
                        <li>Third party suppliers we use to help us:

                            <ul class="a-list a-list--secondary">
                                <li>Carry out our everyday business activities including IT suppliers, actuaries, auditors, lawyers, debt collection agencies, document management providers, outsourced business process management providers, our subcontractors and tax advisors.</li>
                                <li>Provide a service in relation to a claim (e.g. external claims handlers, our accident repair network, medical experts, claims investigators and, in limited circumstances, private investigators).</li>
                            </ul>

                        </li>
                        <li>Credit reference agencies.</li>
                        <li>Data enrichment providers to assist in contact details for the processing of any claim.</li>
                        <li>Providers of demographic data and vehicle data.</li>
                        <li>Financial crime detection agencies and insurance industry databases (e.g. for fraud prevention and checking against international sanctions) including the Claims Underwriting Exchange (known as 'CUE'), CIFAS and the Insurance Fraud Bureau (IFB). The IFB website can be accessed at <a href="https://www.insurancefraudbureau.org/" target="_blank" rel="noopener, noreferrer">www.insurancefraudbureau.org</a>.</li>
                        <li>Insurance industry bodies and databases (including, but not limited to, the Motor Insurance Anti-Fraud and Theft register and the No Claims History database).</li>
                        <li>Government agencies and bodies such as the DVLA, HMRC, Department for Work &amp; Pensions, or professional regulators (e.g. the Financial Conduct Authority).</li>
                        <li>Publicly available sources (e.g. the electoral roll, court judgments, insolvency registers, internet search engines, news articles, social media) and sources licensed under the Open Government Licence v 3.0.</li>
                        <li>The police and other crime prevention and detection agencies. We and fraud prevention agencies may enable law enforcement agencies to access and use your personal data to detect, investigate and prevent crime.</li>
                        <li>Other third parties involved in your insurance policy or a claim (e.g. other insurers).</li>
                        <li>Our reinsurers.</li>
                    </ul>

                    <h5>3.2.2 What we'll use your personal information for</h5>
                    <p>We may process your personal information for a number of different purposes. We must have a legal ground for each purpose and we'll rely on the following grounds:</p>

                    <ul class="a-list a-list--secondary">
                        <li>We have a legitimate interest to use your personal information. For example, to keep a record of the decisions we make when different types of applications are made (e.g. if you request a quotation or make a change to your policy), keep business records, carry out strategic business analysis, review our business planning and develop and improve our products and services. When using your personal information in this way, we'll always consider your rights and interests.</li>
                        <li>We have a legal or regulatory obligation to use your personal information (e.g. to meet the record-keeping requirements of our regulators).</li>
                    </ul>

                    <p>For <span class="u-text-bold">special categories of information</span>, we must have an additional legal ground for processing. We'll rely on the following:</p>

                    <ul class="a-list a-list--secondary">
                        <li>It's in the substantial public interest and it's necessary for an insurance purpose (e.g. assessing your insurance application and managing claims), or to prevent and detect an unlawful act (e.g. fraud).</li>
                        <li>To establish, exercise or defend legal rights e.g. legal proceedings are being brought against us or we want to bring a legal claim ourselves).</li>
                    </ul>

                    <p>Here's how we use your personal information and the legal grounds we rely on:</p>

                    <div class="table-responsive">
                        <table class="table table-bordered table-custom-striped">
                            <thead>
                            <tr>
                                <th>Type of processing</th>
                                <th>Grounds for using personal information</th>
                                <th>Grounds for special categories</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td class="u-text-bold">To manage claims</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to assess and pay your claim and manage the claims process)</li>
                                        <li>We have a legal or regulatory obligation</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>To establish, exercise or defend legal rights</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To verify your identity, prevent and investigate fraud</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to prevent and detect fraud and other financial crime)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>It's in the substantial public interest to prevent or detect unlawful acts (where we suspect fraud)</li>
                                        <li>To establish, exercise or defend legal rights</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To comply with our legal or regulatory obligations</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legal or regulatory obligation</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>To establish, exercise or defend legal rights</li>
                                        <li>It's necessary for an insurance purpose</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To communicate with you in any way and/or resolve any complaints you might have</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to send you communications, record and handle complaints)</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>You've given us your explicit consent</li>
                                        <li>To establish, exercise or defend legal rights</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To provide improved quality, training and security (e.g. through recorded or monitored phone calls to/from us or customer satisfaction surveys)</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to develop and improve our products and services)</li>
                                    </ul>
                                </td>
                                <td>
                                    We won't process your special categories of information for this purpose
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">Managing our business operations (e.g. keeping accounting records, analysing financial results, meeting audit requirements, receiving professional advice and holding our own insurance)</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to carry out business operations and activities that are necessary for the everyday running of a business)</li>
                                    </ul>
                                </td>
                                <td>
                                    We won't process your special categories of information for this purpose
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">For insurance administration purposes including trend analysis, actuarial work, pricing analysis, analysis of customer experience, planning service delivery, risk assessment and costs and charges</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to develop and improve our products and services)</li>
                                    </ul>
                                </td>
                                <td>
                                    We won't process your special categories of information for this purpose
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <h5>3.2.3 Who we'll share your personal information with</h5>
                    <p>We'll share personal information within Hastings Group Holdings limited and/or with the following third parties for the purposes laid out in the table above:</p>

                    <ul class="a-list a-list--secondary">
                        <li>Third parties involved in administration in any part of the relevant insurance policy or claim. These include loss adjusters, claims handlers, private investigators, data enrichment providers to gain contact details, accountants, auditors, banks, lawyers and other experts including medical experts.</li>
                        <li>Other insurers (e.g. where another insurer has previously provided you with a policy or handled a claim) and our reinsurers.</li>
                        <li>Third party suppliers we appoint to help us carry out our everyday business activities including IT suppliers, actuaries, auditors, lawyers, document management providers, outsourced business process management providers, our subcontractors and tax advisors.</li>
                        <li>Insurance brokers and other intermediaries.</li>
                        <li>Credit reference agencies.</li>
                        <li>Insurance industry bodies and databases (including, but not limited to, the Motor Insurance Anti-Fraud and Theft register and the No Claims History database).</li>
                        <li>Financial crime detection agencies and insurance industry databases (e.g. for fraud prevention and checking against international sanctions) including the Claims Underwriting Exchange (known as 'CUE'), CIFAS and the Insurance Fraud Bureau (IFB). The IFB website can be accessed at <a href="https://www.insurancefraudbureau.org/" target="_blank" rel="noopener, noreferrer">www.insurancefraudbureau.org</a></li>
                        <li>Government agencies and bodies such as the DVLA, HMRC, Department for Work &amp; Pensions, or regulators (e.g. Financial Conduct Authority).</li>
                        <li>Professional regulators (e.g. the Financial Conduct Authority in the UK).</li>
                        <li>The police and other crime prevention and detection agencies. We and fraud prevention agencies may enable law enforcement agencies to access and use your personal data to detect, investigate and prevent crime.</li>
                        <li>Selected third parties in connection with any sale, transfer or disposal of our business.</li>
                    </ul>

                    <h5>3.3 Where you witnessed an event involving one of our customers </h5>

                    <p class="u-text-bold">3.3.1 What personal information we'll collect and where we'll collect it
                        from</p>
                    <p>We'll collect the following personal information from you where relevant:</p>

                    <ul class="a-list a-list--secondary">
                        <li><span class="u-text-bold">Individual details:</span> Your name, address, contact details
                            (e.g. email/telephone), gender, date of birth and nationality.
                        </li>
                        <li><span class="u-text-bold">Employment information:</span> Your job title and the nature of
                            the industry you work in.
                        </li>
                        <li><span class="u-text-bold">Identification details:</span> Your national insurance number,
                            passport information and driving licence.
                        </li>
                        <li><span class="u-text-bold">Claims information:</span> In relation to any incident or alleged
                            incident you've witnessed.
                        </li>
                        <li><span class="u-text-bold">Photo or video data:</span> Includes photos or footage recorded
                            relating to a claim (including accident circumstances and interviews).
                        </li>
                        <li><span
                            class="u-text-bold">Website use, including cookies and use of our web chat service:</span>
                            See section 4 below for details.
                        </li>
                        <li><span class="u-text-bold">Other information:</span> Any that we capture during recordings of
                            our telephone calls, in correspondence with us or if you make a complaint. This may include
                            other <span class="u-text-bold">special categories of information</span> you volunteer when
                            communicating with us about the incident you witnessed. We'll only process this information
                            where it relates to the incident itself or legal proceedings. Any further processing will
                            only be with your explicit consent.
                        </li>
                    </ul>

                    <p>We use external sources to supplement and verify the information above and also to provide the
                        following new information. We would always have a justification and be proportionate:</p>

                    <ul class="a-list a-list--secondary">
                        <li><span class="u-text-bold">Claims assessment reports:</span> By both claims investigators,
                            and in limited circumstances, private investigators.
                        </li>
                        <li><span class="u-text-bold">Open source data:</span> Unstructured data in the public domain,
                            including social media, about you or the circumstances of any accident.
                        </li>
                    </ul>

                    <p>The external sources that provide us with information about you include:</p>

                    <ul class="a-list a-list--secondary">
                        <li>Other parties involved in the incident you witnessed (such as any named individual insured
                            through us, passengers, other witnesses, third party claimants, brokers, insurers and the
                            emergency services).
                        </li>
                        <li>Other third parties who provide a service in relation to a claim (such as external claims
                            handlers, our accident repair network, medical experts, claims investigators and, in limited
                            circumstances, private investigators).
                        </li>
                        <li>Other insurers.</li>
                        <li>Publicly available sources (e.g. the electoral roll, court judgments, insolvency registers,
                            internet search engines, news articles, social media).
                        </li>
                        <li>Other Hastings Group companies.</li>
                    </ul>

                    <p class="u-text-bold">3.3.2 What we'll use your personal information for</p>
                    <p>We may process your personal information for a number of different purposes. We must have a legal
                        ground for each purpose and we'll rely on the following grounds:</p>

                    <ul class="a-list a-list--secondary">
                        <li>We have a legal or regulatory obligation to use your personal information (our regulators
                            impose certain record-keeping rules which we must adhere to).
                        </li>
                        <li>We have a legitimate interest to use your personal information (e.g. to keep a record of the
                            decisions we make when different types of applications are made, keep business records,
                            carry out strategic business analysis, review our business planning and develop and improve
                            our products and services). When using your personal information in this way, we'll always
                            consider your rights and interests.
                        </li>
                    </ul>

                    <p>We must have an additional legal ground for processing <span class="u-text-bold">special categories of
					information</span>. We'll rely on the following:</p>

                    <ul class="a-list a-list--secondary">
                        <li>It is necessary for an insurance purpose and it's in the substantial public interest. This
                            will apply where we're helping with any claims under a policy (we'll only rely on this legal
                            ground if we've not been able to obtain or you've not given us your explicit consent) and
                            undertaking any activities to prevent and detect fraud.
                        </li>
                        <li>To establish, exercise or defend legal rights (e.g. legal proceedings are being brought
                            against us or we want to bring a legal claim ourselves).
                        </li>
                    </ul>

                    <p>Here's how we use your personal information and the legal grounds we rely on:</p>

                    <div class="table-responsive">
                        <table class="table table-bordered table-custom-striped">
                            <thead>
                            <tr>
                                <th>Type of processing</th>
                                <th>Grounds for using personal information</th>
                                <th>Grounds for special categories</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td class="u-text-bold">To investigate and manage claims made under an insurance
                                    policy
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to assess and pay claims and manage the
                                            claims process
                                        </li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>You've given us your explicit consent or it's necessary for an insurance
                                            purpose
                                        </li>
                                        <li>To establish, exercise or defend legal rights</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To comply with our legal or regulatory obligations</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legal or regulatory obligation</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>You've given us your explicit consent</li>
                                        <li>To establish, exercise or defend legal rights</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">To prevent and investigate fraud</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to prevent and detect fraud and other
                                            financial crime)
                                        </li>
                                    </ul>
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>It's in the substantial public interest to prevent or detect unlawful acts
                                            (where we suspect fraud)
                                        </li>
                                        <li>To establish, exercise or defend legal rights</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">For business processes and activities including analysis,
                                    review, planning and transactions
                                </td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to effectively manage our business)</li>
                                    </ul>
                                </td>
                                <td>
                                    We won't process your special categories of information for this purpose
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <p class="u-text-bold">3.3.3 Who we'll share your personal information with</p>
                    <p>We'll share personal information within Hastings Group Holdings limited and/or with the following
                        third parties for the purposes laid out in the table above:</p>

                    <ul class="a-list a-list--secondary">
                        <li>Other parties involved in the incident you witnessed.</li>
                        <li>Other insurers (e.g. where another insurer is also involved in the claim which relates to
                            the incident you witnessed) and our reinsurers.
                        </li>
                        <li>Third parties involved in the administration of an insurance policy or claim. These include
                            loss adjusters, claims handlers, accountants, auditors, banks, lawyers, medical experts and,
                            in limited circumstances, private investigators.
                        </li>
                        <li>Third party suppliers we use to help us carry out our everyday business activities including
                            IT suppliers, actuaries, auditors, lawyers, document management providers, outsourced
                            business process management providers, our subcontractors and tax advisors.
                        </li>
                        <li>Insurance industry bodies and databases (including, but not limited to, the Motor Insurance
                            Anti-Fraud and Theft register and the No Claims History database).
                        </li>
                        <li>Financial crime detection agencies and insurance industry databases (e.g. for fraud
                            prevention and checking against international sanctions) including the Claims Underwriting
                            Exchange (known as 'CUE'), CIFAS and the Insurance Fraud Bureau (IFB). The IFB website can
                            be accessed at <a href="https://www.insurancefraudbureau.org/" target="_blank"
                                              rel="noopener, noreferrer">www.insurancefraudbureau.org</a>.
                        </li>
                        <li>Government agencies and bodies such as the DVLA, HMRC, Department for Work &amp; Pensions,
                            or regulators (e.g. Financial Conduct Authority).
                        </li>
                        <li>The police and other crime prevention and detection agencies. We and fraud prevention
                            agencies may enable law enforcement agencies to access and use your personal data to detect,
                            investigate and prevent crime.
                        </li>
                        <li>Selected third parties in connection with any sale, transfer or disposal of our business.
                        </li>
                    </ul>
                </div>
            ]
        }, {
            header: '4. Use of our website and mobile app',
            content: [
                <div>
                    <p class="u-text-bold">4.1 What personal information we'll collect and where we'll collect it from</p>
                    <p>We use various software (including cookies) to improve your digital journey and to identify and prevent
                        fraud. We collect and store information about how you access and use our website, app and MyAccount
                        (including the website you visited before coming to ours). We automatically receive the IP address of
                        your computer, mobile device or the proxy server you use to access the internet and this may include
                        information to identify your browser or device to analyse web traffic.</p>
                    <p>Fraud prevention cookies collect information about certain features of your device, such as your IP
                        address, device type, browser type, screen resolution and operating system. This is to prevent and
                        detect devices associated with fraudulent or other malicious activity and allows us to authenticate your
                        account.</p>

                    <p class="u-text-bold">4.2 What we'll use your personal information for</p>
                    <p>We may process your personal information for a number of different purposes. We must have a legal ground
                        for each purpose and we'll rely on the following ground:</p>

                    <ul class="a-list a-list--secondary">
                        <li>We have a legitimate interest to use your personal information (e.g. maintaining our business
                            records, monitoring usage of our website, marketing our services, and improving our business model
                            and services). When using your personal information in this way, we have considered your rights and
                            ensured our business need doesn't cause you harm.
                        </li>
                    </ul>

                    <p>Here's how we use your personal information and the legal grounds we rely on:</p>

                    <div class="table-responsive">
                        <table class="table table-bordered table-custom-striped">
                            <thead>
                            <tr>
                                <th>Type of processing</th>
                                <th>Grounds for using personal information</th>
                                <th>Grounds for special categories</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td class="u-text-bold">Communicating with you and responding to any enquiries you have</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to communicate with you or to respond to any
                                            enquiries)
                                        </li>
                                    </ul>
                                </td>
                                <td>
                                    We won't process your special categories of information for this purpose.
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">Monitoring usage of our website</td>
                                <td>
                                    <ul class="a-list a-list--secondary">
                                        <li>We have a legitimate interest (to assess usage of and gain insight from our website
                                            and/or app)
                                        </li>
                                    </ul>
                                </td>
                                <td>
                                    We won't process your special categories of information for this purpose
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ]
        }, {
            header: '5. Our approach to sending your personal data abroad ',
            content: [
                <div>
                    <p>Sometimes we'll transfer the personal information we collect about you to other countries.</p>
                    <p>When a transfer happens we'll take steps to make sure your personal information is protected. We'll do
                        this using a number of different methods including:</p>

                    <ul class="a-list a-list--secondary">
                        <li>Only transferring data to countries that have been deemed by the UK as having adequate privacy
                            legislation, so transferring data to them is considered equivalent to processing within the UK.
                        </li>
                        <li>Establishing appropriate contracts. We'll use a set of contract wording known as the 'standard
                            contractual clauses' which has been approved by the data protection authorities.
                        </li>
                        <li>Or where data protection allows under Article 49 (for example where a transfer is necessary in an
                            emergency).
                        </li>
                    </ul>
                </div>
            ]
        }, {
            header: '6. Marketing ',
            content: [
                <div>
                    <p>When you've requested a quote or bought a policy with us we can contact you about similar products and
                        services unless you have opted out. If we intend to market other products we will ask for your
                        permission to do this first. We'll contact you for marketing purposes – for example, to offer other
                        services or to ask if you want to take part in a competition we might run.</p>
                    <p>You may also give your permission for us to contact you when you visit a price comparison site for an
                        insurance quote. This would be because our product featured as one with a competitive price you could
                        choose from and you wanted us to contact you.</p>
                    <p>You're free to object to receiving any marketing material and can edit your marketing preferences at any
                        time. To opt out of marketing communications you can click 'unsubscribe' on any marketing message we
                        send you, change your preferences in MyAccount, or contact us (see Section 11).</p>
                    <p>We have a legitimate interest to be able to contact you to discuss how your policy (or your claim) is
                        being administered. This form of contact falls outside of your marketing preferences and must continue
                        so we can provide you with a policy effectively. This will never include marketing material and all
                        information will be strictly related to your policy or claim.</p>
                </div>
            ]
        }, {
            header: '7. How long we keep your personal information for ',
            content: [
                <div>
                    <p>We are subject to various legal requirements concerning retention of data, and also have our own
                        legitimate interests in retaining your data for a period of time beyond your policy lifetime. These
                        interests include the defense of any late or delayed claims and improving our products and pricing. We
                        will not retain your personal data for longer than is reasonably necessary.</p>
                    <p>In the circumstances involving the prevention or detection of crime and the apprehension or prosecution
                        of offenders, Hastings Insurance Service Limited and agencies can hold your personal data for different
                        periods of time.</p>
                </div>
            ]
        }, {
            header: '8. Automated processing ',
            content: [
                <div>
                    <p>If a human is involved in the decision at any point it is not considered an automated decision. When
                        deciding whether to offer an insurance policy, we use automated processing. The process considers the
                        information you provide us, as well as information from other sources such as search tools. These are
                        used to determine whether your application for insurance can be accepted and what the price of the
                        policy should be. The automated decisions include:</p>

                    <ul class="a-list a-list--secondary">
                        <li>The creation of pricing models and risk acceptance criteria.</li>
                        <li>The application of the pricing and risk models using data we hold about you, to accept or decline
                            your request for insurance and to calculate the price of your policy.
                        </li>
                        <li>Assessing your ability to pay the insurance premiums and/or credit.</li>
                        <li>Assessing the risk of fraud being committed on your policy.</li>
                    </ul>

                    <p>This means we may automatically decide you pose a fraud or money laundering risk. We do this if our
                        processing reveals your behaviour to be consistent with money laundering or known fraudulent conduct, or
                        is inconsistent with your previous submissions, or you appear to have deliberately hidden your true
                        identity.</p>
                    <p>If we, or a fraud prevention agency, determine you pose a fraud or money laundering risk, we may refuse
                        to provide the services or financing you have requested, or we may stop providing existing services to
                        you. A record of any fraud or money laundering risk may be passed to the fraud prevention agencies such
                        as the Claims and Underwriting Exchange (CUE), CIFAS and the Insurance Fraud Bureau (IFB), and may
                        result in others refusing to provide services, financing or employment to you.</p>
                </div>
            ]
        }, {
            header: '9. Your rights ',
            content: [
                <div>
                    <p>Under data protection law you have a number of rights in relation to the personal information we hold
                        about you. You can exercise these rights by contacting us. We won't usually charge you in relation to a
                        request.</p>
                    <div class="table-responsive">
                        <table class="table table-bordered">
                            <tbody>
                            <tr>
                                <td class="u-text-bold">The right to access your personal information</td>
                                <td>You're entitled to a copy of the personal information we hold about you and certain details
                                    of how we use it. We'll usually provide your personal information to you in an email unless
                                    you request otherwise.
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">The right to rectification</td>
                                <td>We take reasonable steps to make sure the information we hold about you is accurate and,
                                    where necessary, up-to-date and complete. If you believe there are any inaccuracies,
                                    discrepancies or gaps in the information we hold about you, you can contact us and ask us to
                                    update or amend it.
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">The right to erasure</td>
                                <td>This is sometimes known as the 'right to be forgotten'. It entitles you, in certain
                                    circumstances, to request your personal information be deleted. For example, where we no
                                    longer need your personal information for the original purpose we collected it for or where
                                    you have exercised your right to withdraw consent. While we will assess every request, there
                                    are other factors that will need to be taken into consideration. For example, we may not be
                                    able to erase your information as you've requested because we have a regulatory obligation
                                    to keep it.
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">The right to restriction of processing</td>
                                <td>In certain circumstances, you're entitled to ask us to stop using your personal information,
                                    for example where you think the personal information we hold about you may be inaccurate or
                                    where you think we no longer need to use your personal information.
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">The right to data portability</td>
                                <td>In certain circumstances, you can request we transfer personal information you've provided
                                    to us to a third party.
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">The right to object to marketing</td>
                                <td>You have control over the extent to which we market to you and the right to request we stop
                                    sending you marketing messages at any time. You can do this either by clicking on the
                                    'unsubscribe' link or button in any email we send you or by contacting us using the details
                                    set out in section 10. Even if you exercise this right because you do not want to receive
                                    marketing messages, we may still send you service related communications where necessary.
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">The right to object to processing</td>
                                <td>In addition to the right to object to marketing, in certain circumstances you'll also have
                                    the right to object to us processing your personal information. This will be when we're
                                    relying on there being a legitimate interest to process your personal information. In some
                                    circumstances, we will not be able to cease processing your information, but we'll let you
                                    know if this is the case.
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">Rights relating to automated decisions</td>
                                <td>If you've been subject to an automated decision and don't agree with the outcome, you can
                                    ask us to review it.
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">The right to withdraw consent</td>
                                <td>Where we rely on your consent in order to process your personal information, you have the
                                    right to withdraw such consent to the further use of your personal information. We'll advise
                                    you of this at the point of collection of your data.
                                </td>
                            </tr>
                            <tr>
                                <td class="u-text-bold">The right to lodge a complaint with the ICO</td>
                                <td>You have a right to complain to the Information Commissioner's Office if you believe that
                                    any use of your personal information by us is in breach of applicable data protection laws
                                    and/or regulations. More information can be found on the Information Commissioner's Office
                                    <a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer">website</a>. This
                                    will not affect any other legal rights or remedies that you have.
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>There may be some circumstances where we cannot comply with your request. For example, we would not be
                        able to agree to your request if it would mean we couldn't comply with our own legal or regulatory
                        requirements. In these instances, we'll let you know why we cannot agree to your request.</p>
                </div>
            ]
        }, {
            header: '10. How we protect your information ',
            content: [
                <div>
                    <p>The protection of your personal data is very important to us. We take a number of technical and
                        procedural measures to protect personal data. For example:</p>

                    <ul class="a-list a-list--secondary">
                        <li>Where we capture your personal information through our website, we'll do this over a secure link
                            using recognised industry standard technology (SSL) which encrypts data that's transmitted over the
                            internet. Most browsers will indicate this by displaying a padlock symbol on the screen.
                        </li>
                        <li>We prevent unauthorised electronic access to our servers by use of suitable firewalls and network
                            security measures. We use strong internal antivirus and malware monitoring tools and conduct regular
                            vulnerability scans to protect our internal infrastructure and also to protect communications we may
                            send you electronically. Our servers are located in secure datacentres that are operated to
                            recognised industry standards. Only authorised people are allowed entry and this is only in certain
                            situations.
                        </li>
                        <li>When you pay for a product by credit card, your card details are protected in accordance with the
                            industry standard security practice called PCI DSS which includes the encryption of cardholder data
                            if transmitted over the internet.
                        </li>
                        <li>We make sure only authorised people within our business have access to your data. We do regular
                            checks to validate that only the correct people have access. We promote responsible access to data
                            and segregate who can see what data within the organisation.
                        </li>
                        <li>Internally we have password policies in place which ensure passwords are strong and complex and are
                            changed regularly.
                        </li>
                        <li>We use secure email exchange where necessary for sensitive data and have security monitoring on all
                            email we send and receive.
                        </li>
                        <li>We run regular tests and checks of all security measures to ensure they continue to be efficient and
                            effective, taking into account technological developments.
                        </li>
                        <li>Our systems design and delivery processes include data protection, information security and cyber
                            resiliency consideration throughout.
                        </li>
                    </ul>
                </div>
            ]
        }, {
            header: '11. Contact us  ',
            content: [
                <div>
                    <p>If you want to exercise the rights set out above, or if you have any questions about how we collect,
                        store or use your personal information, our Data Protection Officer and Team can be reached as
                        follows:</p>

                    <ul class="a-list a-list--secondary">
                        <li>Post: The Data Protection Team, Hastings Insurance Services Limited, Conquest House, Collington
                            Avenue, Bexhill-on-Sea TN39 3LW
                        </li>
                        <li>Email: <a href="mailto:dataprotection@hastingsdirect.com">dataprotection@hastingsdirect.com</a></li>
                        <li>Telephone: <a href="tel:+443333219801">0333 321 9801</a>.</li>
                    </ul>
                </div>
            ]
        }, {
            header: '12. Updates to this Privacy Policy ',
            content: [
                <div>
                    <p>We may need to make changes to this Privacy Policy periodically. This could be as the result of
                        government regulation, new technologies or other developments in data protection laws or privacy
                        generally or where we identify new sources and uses of personal information (provided such use is
                        compatible with the purposes for which the personal information was originally collected). The Data
                        Protection Officer will make sure that this document is updated regularly or as legislation
                        requires.</p>
                    <p>
                        <span>Date of last update: 16th February 2021</span>
                    </p>
                </div>
            ]
        }, {
            header: '13. Copies of this notice ',
            content: [
                <div>
                    <ul class="a-list a-list--arrow a-list--no-margin-bottom">
                        <li>View the <a href="/documents/legal/privacy-notice.pdf" class="a-icon-pdf" target="_blank">Privacy
                            notice</a> as a PDF.
                        </li>
                    </ul>
                </div>
            ]
        }];

        const handleClose = () => {
            setOpen(false);
        };

        return (
            <div className="privacy-policy">
                <HDOverlayPopup
                    id="modal-privacy-policy"
                    labelText={messages.policyHeader}
                    overlayButtonIcon={(
                        <HDLabelRefactor Tag="a" text={urlText} className="secondary-style"/>
                    )}
                >
                    <div className="acceptance-criteria-overlay-container">
                        <Row>
                            <Col>
                                <HDAccordionRefactor cards={questions}/>
                            </Col>
                        </Row>


                    </div>
                </HDOverlayPopup>
            </div>
        );
    }
;

const mapStateToProps = (state) => ({
    epticaId: state.epticaId,

});

HDPrivacyPolicy.propTypes = {
    epticaId: PropTypes.number,
    urlText: PropTypes.string,
};

HDPrivacyPolicy.defaultProps = {
    epticaId: null,
    urlText: 'Please click here'
};

export default connect(mapStateToProps, null)(HDPrivacyPolicy);
