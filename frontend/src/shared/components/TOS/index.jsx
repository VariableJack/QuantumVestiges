import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const TOS = props => {
    return (
        <div>
            <h1>Terms of Service</h1>
            <br />
            By continuing through the account creation process, you agree with the following all
            Terms and Conditions outlined below. You are free to download this page as a reference.
            If you do not agree to all Terms and Conditions, you may not create an account with us
            and may not partake in any of the features or products that we offer.{' '}
            <h2>Terminology</h2>
            <br />
            <ul>
                <li>
                    <b>
                        We | Us | Quantum Vestiges Games | Quantum Vestiges LLC | Quantum Vestiges
                        Games LLC | Quantum Vestiges
                    </b>{' '}
                    - refers to the business entity that serves and maintains this website and all
                    products offered on the website, such as video games, board games, and other
                    merchandise
                </li>
                <li>
                    <b>You</b> - The user or parent/guardian of the user
                </li>
            </ul>
            <br />
            <h2>Terms and Conditions</h2>
            <br />
            <ol>
                <li>
                    In order for you to create an account with us and use our services, you must:
                    <ul>
                        <li>
                            Be at least 18 years old or the age of majority in your country,
                            whichever is higher
                        </li>
                        <li>
                            Have your legal parent or guardian read and agree to these Terms and
                            Conditions
                        </li>
                    </ul>
                </li>
                <li>
                    In order to provide a safe community, no hate speech of{' '}
                    <b>
                        <i>any</i>
                    </b>{' '}
                    kind is allowed on any chat forum, private or public. For example, racism,
                    sexism, or religious hate speech towards specific religions, are not allowed.
                </li>
                <ul>
                    <li>The first offense will result in a 30-day ban.</li>
                    <li>The second offense will result in a 1-year ban.</li>
                    <li>The third offense will result in a permanent ban.</li>
                </ul>
                <li>
                    <b>
                        <i>Any</i>
                    </b>{' '}
                    threats of violence, physical, emotional or otherwise, are never allowed and
                    will result in an{' '}
                    <b>
                        <i>immediate permanent ban without appeal</i>
                    </b>
                    .
                </li>
                <li>
                    Similary,{' '}
                    <b>
                        <i>any</i>
                    </b>{' '}
                    doxxing or other action deemed as harassment, or if anyone reports to feel
                    unsafe or uncomfortable with your action or words, will result in an{' '}
                    <b>
                        <i>immediate permanent ban without appeal</i>
                    </b>
                    .
                </li>
                <li>
                    This ToS is subject to be updated at any time should it be warrented. You will
                    be notified via email up to 7 days before any changes are applied.
                </li>
            </ol>
            <span>This version of the ToS is effective as of July 1, 2026</span>
        </div>
    )
}

export default TOS
