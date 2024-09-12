import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdChevronLeft } from 'react-icons/md';
import { Link } from 'react-router-dom';

function GroupDetails() {
  const { id } = useParams();

  // Mock data for group details
  const groupDetails = {
    name: 'Manans Date',
    description: 'Library Date.',
    default_split_type: 'Equal',
    default_split_percentages: [
      { group_member_id: '1', percentage: 50 },
      { group_member_id: '2', percentage: 50 },
    ],
  };

  // Mock data for group members
  const groupMembers = [
    { id: '1', name: 'Manan', email: 'manan@example.com' },
    { id: '2', name: 'Vismaya', email: 'vis@example.com' },
    // Add more mock members as needed
  ];

  return (
    <div className="p-1 overflow-y-auto max-h-screen">
      <div className="pb-16">
        {/* Header Section */}
        <div className="sticky top-0 z-50 bg-background shadow-md">
          <div
            className="text-white p-14 bg-background rounded-lg shadow-md"
            style={{
              backgroundImage: "url('/stacked-waves.svg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="flex items-center justify-between">
              <Link to="/groups">
                <button
                  className="bg-transparent text-white px-2 py-2 rounded-lg hover:bg-secondary flex items-center"
                  title="Back to Groups"
                >
                  <MdChevronLeft className="text-2xl" />
                </button>
              </Link>
              <div className="text-center flex-grow">
                <p className="text-2xl font-semibold">{groupDetails.name}</p>
                <p className="text-lg font-bold text-gray-400">{groupDetails.description}</p>
              </div>
              <div className="w-10"></div> {/* Placeholder for alignment */}
            </div>
          </div>
        </div>

        <div className="p-2">
          {/* Group Information Section */}
          <div className="rounded-lg pb-2 border shadow-md mt-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl font-bold p-3 pb-1"
            >
              Group Information
            </motion.h2>

            <div className="px-3 py-2">
              <div className="mt-1 space-y-4">
                <div className="rounded-lg bg-card border border-gray-500 shadow p-4">
                  <p>
                    <strong>Default Split Type:</strong> {groupDetails.default_split_type}
                  </p>
                  {/* Add more fields from groupDetails as needed */}
                </div>
              </div>
            </div>
          </div>

          {/* Group Members Section */}
          <div className="rounded-lg pb-2 border shadow-md mt-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl font-bold p-3 pb-1"
            >
              Group Members
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {groupMembers.map((member, index) => (
                  <div key={index} className="px-3 py-2">
                    <div className="mt-1 space-y-4">
                      <div className="rounded-lg bg-card border border-gray-500 shadow p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold">{member.name}</p>
                            <p className="text-sm text-gray-400">{member.email}</p>
                          </div>
                          {/* Add action buttons or links if needed */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Default Split Percentages Section */}
          {groupDetails.default_split_type === 'Percentage' && (
            <div className="rounded-lg pb-2 border shadow-md mt-4">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl font-bold p-3 pb-1"
              >
                Default Split Percentages
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="px-3 py-2">
                  <div className="mt-1 space-y-4">
                    {groupDetails.default_split_percentages.map((split, index) => (
                      <div key={index} className="rounded-lg bg-card border border-gray-500 shadow p-4">
                        <p>
                          <strong>Member ID:</strong> {split.group_member_id}
                        </p>
                        <p>
                          <strong>Percentage:</strong> {split.percentage}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
