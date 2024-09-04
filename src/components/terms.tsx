// import { FunctionComponent } from 'react';
// import { Dialog } from '@headlessui/react';

// interface TermsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const TermsModal: FunctionComponent<TermsModalProps> = ({ isOpen, onClose }) => {
//   return (
//     <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
//       <div className="flex min-h-screen items-center justify-center p-4 text-center">
//         <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
//         <div className="relative mx-auto w-full max-w-md rounded bg-white p-6 text-left shadow-xl">
//           <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
//             Terms and Conditions
//           </Dialog.Title>
//           <div className="mt-2">
//             <p className="text-sm text-gray-500">
//               Here are the terms and conditions. Please read them carefully.
//               Terms and Conditions for PocketOwl

// Last Updated: [Date]

// Welcome to PocketOwl! These Terms and Conditions ("Terms") govern your use of the PocketOwl mobile application ("App"), which is provided by [Your Company Name]. By accessing or using our App, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you are prohibited from using the App.
// 1. Acceptance of Terms

// By creating an account and using the App, you confirm that you have read, understood, and agreed to these Terms. You also agree to comply with all applicable laws and regulations.
// 2. Service Description

// PocketOwl is a real-time group expense tracker designed to simplify managing shared expenses for events, trips, or daily activities. Features include:

//     Group creation and expense logging
//     Real-time budget monitoring and bill splitting
//     End-to-end encryption for data security
//     Voting mechanisms for group decision-making
//     Optional AI integration for spending insights and predictive budgeting

// 3. Registration and Account Integrity

//     You must provide accurate and complete registration information.
//     You are responsible for the security of your account and must not disclose your credentials to others.
//     You must notify us immediately of any unauthorized use of your account.

// 4. Privacy Policy

// Our Privacy Policy explains how we collect, use, and share your personal information. By using PocketOwl, you agree to our data practices as described in the Privacy Policy.
// 5. User Conduct

// You agree not to use the App to:

//     Conduct unlawful activities
//     Infringe on the rights of others
//     Spread malicious software
//     Manipulate or disrupt the App’s functionalities

// 6. Intellectual Property

// All intellectual property rights in the App and its content are owned by us or our licensors. You may not use any content from the App without our prior written permission.
// 7. Third-Party Services

// The App may integrate with third-party services like PayPal and Venmo for payment processing. We are not responsible for the content or availability of these services.
// 8. Termination

// We may terminate or suspend your account and access to the App if you breach these Terms.
// 9. Limitation of Liability

// We shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the App.
// 10. Changes to Terms

// We reserve the right to modify these Terms at any time. Your continued use of the App after such modifications will constitute your acceptance of the new Terms.
// 11. Governing Law

// These Terms shall be governed by the laws of [Your Jurisdiction] without regard to its conflict of law provisions.
// 12. Contact Us

// If you have any questions about these Terms, please contact us at [Your Contact Information].
//             </p>
//           </div>
//           <div className="mt-4">
//             <button
//               type="button"
//               className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
//               onClick={onClose}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </Dialog>
//   );
// };

// export default TermsModal;
