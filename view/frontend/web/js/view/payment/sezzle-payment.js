/**
 * @category    Sezzle
 * @package     Sezzle_Sezzlepay
 * @copyright   Copyright (c) Sezzle (https://www.sezzle.com/)
 */
define(
    [
        'uiComponent',
        'Magento_Checkout/js/model/payment/renderer-list',
        'sezzleInContextCheckout'
    ],
    function (
        Component,
        rendererList
    ) {
        'use strict';

        var isInContextCheckout = window.checkoutConfig.payment.sezzlepay.isInContextCheckout,
            isMobileTablet = new Checkout({}).isMobileTablet(),
            sezzleComponent = 'Sezzle_Sezzlepay/js/view/payment/method-renderer' +
                ((isInContextCheckout && !isMobileTablet) ? '/in-context/sezzle' : '/sezzle');

        rendererList.push(
            {
                type: 'sezzlepay',
                component: sezzleComponent
            }
        );

        /** Add view logic here if needed */
        return Component.extend({});
    }
);
