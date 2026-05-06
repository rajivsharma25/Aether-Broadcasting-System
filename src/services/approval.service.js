import ContentService from './content.service';

/**
 * Specialized service to manage the principal's approval and moderation workflow.
 * Acts as a domain-specific wrapper around the ContentService.
 */
const ApprovalService = {
  /**
   * Fetch all content pending principal approval
   */
  getPendingContent: async () => {
    return ContentService.getContent({ status: 'pending' });
  },

  /**
   * Update the status of a content item (Approve/Reject)
   * @param {string} id - Content ID
   * @param {'approved' | 'rejected'} status - New status
   * @param {string} [rejectionReason] - Mandatory if status is rejected
   */
  processContent: async (id, status, rejectionReason = null) => {
    return ContentService.updateStatus(id, status, rejectionReason);
  }
};

export default ApprovalService;
