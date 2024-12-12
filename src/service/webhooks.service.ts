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

  /**
   * Updates an existing webhook subscription in the Coinbase Commerce platform
   *
   * @param webhook_id - The unique identifier of the webhook subscription to update
   * @param params - The webhook update parameters
   * @param params.url - The new URL that will receive webhook events (must be a valid HTTPS URL)
   *
   * @returns {Promise<APIResponse<WebhookResponse>>} A promise that resolves to the merchant data including the updated webhook subscription
   *
   * @example
   * ```typescript
   * const { data: merchantData } = await commerce.webhooks.updateWebhook(
   *   'webhook-id-123',
   *   {
   *     url: 'https://example.com/webhooks/coinbase/new'
   *   }
   * );
   *
   * // Access the updated webhook subscription
   * const updatedWebhook = merchantData.data.settings.webhook_subscriptions
   *   .find(webhook => webhook.id === 'webhook-id-123');
   * ```
   *
   * @throws {SDKError} When the API request fails, webhook is not found, or URL validation fails
   */
  async updateWebhook(
    webhook_id: string,
    params: CreateWebhookParams,
  ): Promise<APIResponse<WebhookResponse>> {
    return this.request<WebhookResponse>({
      data: params,
      path: `/v2/webhooks/subscriptions/${webhook_id}`,
      method: 'PUT',
    });
  }

  /**
   * Retrieves all webhook subscriptions for the merchant
   *
   * @returns {Promise<APIResponse<WebhookResponse>>} A promise that resolves to the merchant data including all webhook subscriptions
   *
   * @example
   * ```typescript
   * const { data: merchantData } = await commerce.webhooks.getWebhooks();
   *
   * // Access all webhook subscriptions
   * const webhooks = merchantData.data.settings.webhook_subscriptions;
   * webhooks.forEach(webhook => {
   *   console.log(`Webhook ${webhook.id} pointing to ${webhook.url}`);
   * });
   *
   * // Access other merchant settings
   * console.log(`Webhook shared secret: ${merchantData.data.settings.webhook_shared_secret}`);
   * ```
   *
   * @throws {SDKError} When the API request fails or authentication fails
   */
  async getWebhooks(): Promise<APIResponse<WebhookResponse>> {
    return this.request<WebhookResponse>({
      path: '/v2/merchant',
      method: 'GET',
    });
  }
}
