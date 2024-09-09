import * as React from "react";
import { useState, ReactNode } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      width: '80%',            
      margin: '1rem auto 0 auto', 
      padding: '0.5rem 1rem',   
      background: '#333',       
      color: '#fff',            
      border: 'none',           
      borderRadius: '0.25rem',  
      cursor: 'pointer',
      fontSize: '1rem',
      display: 'block',         
    }}
    aria-label="Close"
  >
    Close
  </button>
);

interface TermsProps {
  children?: ReactNode; 
}

export const Terms: React.FC<TermsProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button onClick={handleOpen} className="terms-button">
          Terms & Conditions
        </button>
      </PopoverTrigger>
      {open && (
        <PopoverContent onInteractOutside={handleClose}  className="popover-content">
          <h2 className="text-lg text-primary font-semibold mb-4 text-center">Terms and Conditions</h2>
          <div className="children-content">
            {children}
          </div>
          <div className="terms-text">
          <p className="text-sm mb-4">
          Last Updated: 05/09/2024
          </p>
          <p className="text-sm mb-4">

            Welcome to PocketOwl! These Terms and Conditions ("Terms") govern your use of the PocketOwl mobile application ("App"), which is provided by Pocket Owl. By accessing or using our App, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you are prohibited from using the App.
          </p>
          <h5 className="font-medium mt-4 mb-2">1. Acceptance of Terms</h5>
          <p>
            By creating an account and using the App, you confirm that you have read, understood, and agreed to these Terms. You also agree to comply with all applicable laws and regulations.
          </p>
          <h5 className="font-medium mt-4 mb-2">2. Service Description</h5>
          <p>
            PocketOwl is a real-time group expense tracker designed to simplify managing shared expenses for events, trips, or daily activities. Features include:
          </p>
          <ul className="list-disc pl-4 mb-4">
            <li>Group creation and expense logging</li>
            <li>Real-time budget monitoring and bill splitting</li>
            <li>End-to-end encryption for data security</li>
            <li>Voting mechanisms for group decision-making</li>
            <li>Optional AI integration for spending insights and predictive budgeting</li>
          </ul>
          <h5 className="font-medium mt-4 mb-2">3. Registration and Account Integrity</h5>
          <p>
            You must provide accurate and complete registration information. You are responsible for the security of your account and must not disclose your credentials to others. You must notify us immediately of any unauthorized use of your account.
          </p>
          <h5 className="font-medium mt-4 mb-2">4. Privacy Policy</h5>
          <p>
            Our Privacy Policy explains how we collect, use, and share your personal information. By using Pocket Owl, you agree to our data practices as described in the Privacy Policy.
          </p>
          <h5 className="font-medium mt-4 mb-2">5. User Conduct</h5>
          <p>
            You agree not to use the App to:
          </p>
          <ul className="list-disc pl-4 mb-4">
            <li>Conduct unlawful activities</li>
            <li>Infringe on the rights of others</li>
            <li>Spread malicious software</li>
            <li>Manipulate or disrupt the App’s functionalities</li>
          </ul>
          <h5 className="font-medium mt-4 mb-2">6. Intellectual Property</h5>
          <p>
            All intellectual property rights in the App and its content are owned by us or our licensors. You may not use any content from the App without our prior written permission.
          </p>
          <h5 className="font-medium mt-4 mb-2">7. Third-Party Services</h5>
          <p>
            The App may integrate with third-party services like PayPal and Venmo for payment processing. We are not responsible for the content or availability of these services.
          </p>
          <h5 className="font-medium mt-4 mb-2">8. Termination</h5>
          <p>
            We may terminate or suspend your account and access to the App if you breach these Terms.
          </p>
          <h5 className="font-medium mt-4 mb-2">9. Limitation of Liability</h5>
          <p>
            We shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the App.
          </p>
          <h5 className="font-medium mt-4 mb-2">10. Changes to Terms</h5>
          <p>
            We reserve the right to modify these Terms at any time. Your continued use of the App after such modifications will constitute your acceptance of the new Terms.
          </p>
          <h5 className="font-medium mt-4 mb-2">11. Governing Law</h5>
          <p>
            These Terms shall be governed by the laws of UK without regard to its conflict of law provisions.
          </p>
          <h5 className="font-medium mt-4 mb-2">12. Contact Us</h5>
          <p>
            If you have any questions about these Terms, please contact us at pocketOwl@gmail.com.
          </p>
        </div>
        <CloseButton onClick={handleClose} />
        </PopoverContent>
      )}
    </Popover>
  );
};
