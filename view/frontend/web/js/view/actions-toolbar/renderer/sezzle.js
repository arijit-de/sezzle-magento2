/**
 * @category    Sezzle
 * @package     Sezzle_Sezzlepay
 * @copyright   Copyright (c) Sezzle (https://www.sezzle.com/)
 */
define(
    [
        'jquery',
        'Magento_Customer/js/model/customer',
        'Magento_Checkout/js/model/resource-url-manager',
        'mage/storage',
        'Aheadworks_OneStepCheckout/js/view/actions-toolbar/renderer/default',
        'Sezzle_Sezzlepay/js/in-context/checkout-wrapper'
    ],
    function (
        $,
        customer,
        resourceUrlManager,
        storage,
        Component,
        Wrapper) {
        'use strict';

        return Component.extend(Wrapper).extend({
            defaults: {
                template: 'Sezzle_Sezzlepay/actions-toolbar/renderer/sezzle'
            },

            /**
             * Check is customer uuid is available
             * @returns boolean
             */
            hasCustomerUUID: function () {
                var customerCustomAttributes = customer.customerData.custom_attributes;
                return customerCustomAttributes !== undefined
                    && customerCustomAttributes.sezzle_customer_uuid !== undefined
                    && customerCustomAttributes.sezzle_customer_uuid.value;
            },

            isInContextCheckout: function () {
                var isInContextCheckout = window.checkoutConfig.payment.sezzlepay.isInContextCheckout,
                    isMobileOrTablet = window.checkoutConfig.payment.sezzlepay.isMobileOrTablet;
                    return isInContextCheckout && !isMobileOrTablet;
            },

            /**
             * Get Place Order button name
             * @returns string
             */
            getSubmitButtonName: function () {
                return this.hasCustomerUUID() ? "Place Order" : "Continue to Sezzle";
            },

            /**
             * Place Order click event
             */
            placeOrderWithSezzle: function () {
                var self = this;
                    self._getMethodRenderComponent().continueToSezzle();
            }
        });
    }
);

