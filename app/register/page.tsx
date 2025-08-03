'use client';

import { useRef, useState } from 'react';
import '../register.css';

export default function Registration() {
  const [showModal, setShowModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="flex justify-center bg items-center h-auto w-screen relative">
      <h3 className='absolute top-0 mt-[5vh] berserker text-5xl animated animatedFadeInUp fadeInUp text-white drop-shadow-md'>Sphota</h3>
      {/* Form */}
      <div className={`form-container mt-[15vh] mb-[10vh] ${showModal ? 'hidden' : ''}`}>
        <form
          className="form"
          ref={formRef}
          onSubmit={handleSubmit}
          action="https://docs.google.com/forms/d/e/1FAIpQLSfu95byQLy0NudlOVkAvgcoGkJcDaa8rUBQRDhjfGaZCxzpUg/formResponse?"
          method="POST"
        >
          <div className="form-group">
            <label htmlFor="Name">Name</label>
            <input type="text" id="Name" name="entry.2092250368" required />

            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="entry.1135390185" required />

            <label htmlFor="Number">Phone Number</label>
            <input type="text" id="ph" name="entry.364808322" required />

            <label htmlFor="clg">College</label>
            <input type="text" id="clg" name="entry.1589457548" required />

            <label htmlFor="year">Graduation Year</label>
            <input type="number" id="year" name="entry.926337240" required />

            <label htmlFor="branch">Branch</label>
            <input type="text" id="branch" name="entry.977838638" required />
          </div>

          <div className="form-group">
            <label htmlFor="textarea">Description</label>
            <textarea name="entry.44834785" id="textarea" rows={10} cols={50} required />
          </div>

          <button className="form-submit-btn" type="submit">Submit</button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50">
          <div className="bg-gray-900 rounded-lg border border-gray-300 p-6 shadow-lg max-w-lg w-full mx-4">
            <div className="flex items-center gap-4 mb-4">
              <span className="shrink-0 rounded-full bg-red-400 p-2 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <p className="font-medium text-lg text-red-600">Confirmation Required</p>
            </div>

            <p className="text-gray-500 mb-6">
              After submitting the form, you will receive an email containing a payment link.
              Please complete the payment and share a screenshot of the successful transaction with the phone number provided in the email.
              Your ticket will be sent to you via email once the payment is confirmed.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={handleConfirm}
                className="bg-stone-300 text-gray-900 px-4 py-2 rounded hover:bg-stone-400"
              >
                Continue
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
