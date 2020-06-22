<?php
/*
 * @category    Sezzle
 * @package     Sezzle_Payment
 * @copyright   Copyright (c) Sezzle (https://www.sezzle.com/)
 */

namespace Sezzle\Payment\Api\Data;


/**
 * Interface CustomerInterface
 * @package Sezzle\Payment\Api\Data
 */
interface CustomerInterface
{
    const EMAIL = "email";
    const FIRST_NAME = "first_name";
    const LAST_NAME = "last_name";
    const PHONE = "phone";
    const DOB = "dob";
    const BILLING_ADDRESS = "billing_address";
    const SHIPPING_ADDRESS = "shipping_address";

    /**
     * @return string|null
     */
    public function getEmail();

    /**
     * @param string $email
     * @return $this
     */
    public function setEmail($email);

    /**
     * @return string|null
     */
    public function getFirstName();

    /**
     * @param string $firstName
     * @return $this
     */
    public function setFirstName($firstName);

    /**
     * @return string|null
     */
    public function getLastName();

    /**
     * @param string $lastName
     * @return $this
     */
    public function setLastName($lastName);

    /**
     * @return string|null
     */
    public function getPhone();

    /**
     * @param string $phone
     * @return $this
     */
    public function setPhone($phone);

    /**
     * @return string|null
     */
    public function getDob();

    /**
     * @param string $dob
     * @return $this
     */
    public function setDob($dob);

    /**
     * @return \Sezzle\Payment\Api\Data\AddressInterface|null
     */
    public function getBillingAddress();

    /**
     * @param \Sezzle\Payment\Api\Data\AddressInterface $billingAddress
     * @return $this
     */
    public function setBillingAddress(AddressInterface $billingAddress = null);

    /**
     * @return \Sezzle\Payment\Api\Data\AddressInterface|null
     */
    public function getShippingAddress();

    /**
     * @param \Sezzle\Payment\Api\Data\AddressInterface $shippingAddress
     * @return $this
     */
    public function setShippingAddress(AddressInterface $shippingAddress = null);

}
