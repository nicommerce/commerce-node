import { APIResponse } from '../types/api';
import { BaseService } from './base.service';
import { CreateWebhookParams, WebhookResponse } from '../types/webhook';

export class WebhooksService extends BaseService {
  /**
   * Creates a new webhook subscription in the Coinbase Commerce platform
   *
   * @param params - The webhook creation parameters
   * @param params.url - The URL that will receive webhook events (must be a valid HTTPS URL)
   *
   * @returns {Promise<APIResponse<WebhookResponse>>} A promise that resolves to the merchant data including the new webhook subscription
   *
   * @example
   * ```typescript
   * const { data: merchantData } = await commerce.webhooks.createWebhook({
   *   url: 'https://example.com/webhooks/coinbase'
   * });
   *
   * // Access the webhook subscriptions
   * const webhooks = merchantData.data.settings.webhook_subscriptions;
   * console.log(webhooks[webhooks.length - 1].id); // ID of the newly created webhook
   * ```
   *
   * @throws {SDKError} When the API request fails, URL validation fails, or other errors occur
   */
  async createWebhook(
    params: CreateWebhookParams,
  ): Promise<APIResponse<WebhookResponse>> {
    return this.request<WebhookResponse>({
      data: params,
      path: '/v2/webhook/subscriptions',
      method: 'POST',
    });
  }
}
