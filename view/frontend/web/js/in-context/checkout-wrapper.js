/**
 * @category    Sezzle
 * @package     Sezzle_Sezzlepay
 * @copyright   Copyright (c) Sezzle (https://www.sezzle.com/)
 */
define([
    'jquery',
    'mage/translate',
    'Sezzle_Sezzlepay/js/in-context/sezzle-smart-button',
    'Magento_Checkout/js/model/quote',
    'mage/storage',
    'Magento_Customer/js/model/customer',
    'Magento_Checkout/js/action/redirect-on-success',
    'Magento_Checkout/js/model/full-screen-loader',
    'Magento_Checkout/js/model/url-builder',
    'Magento_Checkout/js/model/error-processor',
], function (
    $,
    $t,
    checkoutSmartButtons,
    quote,
    storage,
    customer,
    redirectOnSuccessAction,
    fullScreenLoader,
    urlBuilder,
    errorProcessor) {
    'use strict';

    var serviceUrl,
        payload = {};

    return {
        defaults: {
            paymentActionError: $t('Something went wrong with your request. Please try again later.'),
            paymentCancelError: $t('Payment has been cancelled.'),
            paymentFailureError: $t('Payment has been failed. Verify and try again.'),
            signInMessage: $t('To check out, please sign in with your email address.')
        },

        /**
         * Render Sezzle button using checkout.js
         */
        initSezzleSDKCheckout: function (element) {
            checkoutSmartButtons(this.prepareClientConfig(), element);
        },

        /**
         * Get SDK Config
         *
         * @returns {Object}
         */
        getSDKConfig: function () {
            return {
                'mode': this.clientConfig.inContextMode,
                'apiMode': this.clientConfig.inContextTransactionMode,
                'apiVersion': this.clientConfig.inContextApiVersion
            };
        },

        /**
         * Get Checkout Payload
         *
         * @returns {string}
         */
        getCheckoutObject: function () {
            payload.createSezzleCheckout = false;
            if (!customer.isLoggedIn()) {
                serviceUrl = urlBuilder.createUrl('/sezzle/guest-carts/:cartId/create-checkout', {
                    cartId: quote.getQuoteId()
                });
                payload.email = quote.guestEmail;
            } else {
                serviceUrl = urlBuilder.createUrl('/sezzle/carts/mine/create-checkout', {});
            }

            fullScreenLoader.startLoader();
            return storage.post(
                serviceUrl, JSON.stringify(payload)
            ).success(
                function (response) {
                    var jsonResponse = $.parseJSON(response);
                    return jsonResponse.payload;
                }
            ).fail(
                function (response) {
                    errorProcessor.process(response, messageContainer);
                }
            ).always(
                function () {
                    fullScreenLoader.stopLoader();
                }
            );
        },

        /**
         * After Checkout Complete Action
         */
        afterOnComplete: function () {
            fullScreenLoader.startLoader();
            if (!customer.isLoggedIn()) {
                serviceUrl = urlBuilder.createUrl('/sezzle/guest-carts/:cartId/place-order', {
                    cartId: quote.getQuoteId()
                });
            } else {
                serviceUrl = urlBuilder.createUrl('/sezzle/carts/mine/place-order', {});
            }

            return storage.post(
                serviceUrl
            ).success(
                function (response) {
                    redirectOnSuccessAction.execute();
                }
            ).fail(
                function (response) {
                    errorProcessor.process(response, this.messageContainer);
                }
            ).always(
                function () {
                    fullScreenLoader.stopLoader();
                }
            );
        },

        /**
         * Before Checkout Complete Action
         */
        beforeOnComplete: function () {
        },

        /**
         * Handle Checkout Complete Exception
         */
        catchOnComplete: function () {
        },

        /**
         * After Checkout Cancel Action
         */
        afterOnCancel: function () {
        },

        /**
         * Before Checkout Cancel Action
         */
        beforeOnCancel: function () {
        },

        /**
         * Handle Checkout Cancel Exception
         */
        catchOnCancel: function () {
            errorProcessor.process(
                {
                    responseText: JSON.stringify({message:this.paymentCancelError})
                },
                this.messageContainer
            );
        },

        /**
         * After Checkout Failure Action
         */
        afterOnFailure: function () {
        },

        /**
         * Before Checkout Failure Action
         */
        beforeOnFailure: function () {
        },

        /**
         * Handle Checkout Failure Exception
         */
        catchOnFailure: function () {
            errorProcessor.process(
                {
                    responseText: JSON.stringify({message:this.paymentFailureError})
                },
                this.messageContainer
            );
        },

        /**
         * After Sezzle Button onClick Action
         */
        afterOnClick: function () {
        },

        /**
         * Before Sezzle Button onClick Action
         *
         * @returns {Promise}
         */
        beforeOnClick: function () {
            payload.createSezzleCheckout = true;
            if (!customer.isLoggedIn()) {
                serviceUrl = urlBuilder.createUrl('/sezzle/guest-carts/:cartId/create-checkout', {
                    cartId: quote.getQuoteId()
                });
                payload.email = quote.guestEmail;
            } else {
                serviceUrl = urlBuilder.createUrl('/sezzle/carts/mine/create-checkout', {});
            }

            return storage.post(
                serviceUrl, JSON.stringify(payload)
            );
        },

        /**
         * Handle Sezzle Button onClick Exception
         */
        catchOnClick: function () {
        },

        /**
         * Get Button ID
         *
         * @returns {String}
         */
        getButtonId: function () {
            return this.inContextId;
        },

        /**
         * Populate client config with all required data
         *
         * @return {Object}
         */
        prepareClientConfig: function () {
            this.clientConfig = {};
            this.clientConfig.rendererComponent = this;
            this.clientConfig.sezzleButtonContainerElementID = "sezzle-smart-button-container";
            this.clientConfig.formKey = $.mage.cookies.get('form_key');
            this.clientConfig.inContextMode = window.checkoutConfig.payment.sezzlepay.inContextMode;
            this.clientConfig.inContextTransactionMode = window.checkoutConfig.payment.sezzlepay.inContextTransactionMode;
            this.clientConfig.inContextApiVersion = window.checkoutConfig.payment.sezzlepay.inContextApiVersion;

            return this.clientConfig;
        }
    };
});
