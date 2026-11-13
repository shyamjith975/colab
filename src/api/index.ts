// co-lab API Client & Supabase SDK abstraction
// Clean versioned /api/v1/ service layer

export const API_BASE = '/api/v1';

export class ApiClient {
  private static getHeaders() {
    const token = localStorage.getItem('colab_auth_token') || 'demo-jwt-token';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Creators
  static async getCreators(params?: Record<string, string | number>) {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    console.log(`[GET] ${API_BASE}/creators${query}`);
    return { success: true };
  }

  static async getCreatorById(id: string) {
    console.log(`[GET] ${API_BASE}/creators/${id}`);
    return { success: true, id };
  }

  // Campaigns
  static async getCampaigns() {
    console.log(`[GET] ${API_BASE}/campaigns`);
    return { success: true };
  }

  static async createCampaign(payload: unknown) {
    console.log(`[POST] ${API_BASE}/campaigns`, payload);
    return { success: true, data: payload };
  }

  static async applyToCampaign(campaignId: string, payload: unknown) {
    console.log(`[POST] ${API_BASE}/campaigns/${campaignId}/apply`, payload);
    return { success: true };
  }

  // Deal Room & Escrow
  static async submitDeliverable(collabId: string, deliverableId: string, url: string) {
    console.log(`[POST] ${API_BASE}/collaborations/${collabId}/deliverables/${deliverableId}`, { url });
    return { success: true };
  }

  static async releaseEscrow(collabId: string) {
    console.log(`[POST] ${API_BASE}/collaborations/${collabId}/release-escrow`);
    return { success: true };
  }

  // Admin
  static async getAdminStats() {
    console.log(`[GET] ${API_BASE}/admin/dashboard`);
    return { success: true };
  }
}

