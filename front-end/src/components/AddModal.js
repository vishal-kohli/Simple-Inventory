import React, { useState } from 'react';
import { Button, Form, Modal } from "react-bootstrap";

const AddModal = (props) => {

    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const closeModal = () => {
        props.setModalError(null);
        props.setShowModal(false);

    }
    const addItem = () => {
        let itemName = document.getElementById("itemNameField").value;
        let itemQuantity = document.getElementById("itemQuantityField").value;

        props.addItemsToInventory({
            itemName: itemName,
            itemQuantity: itemQuantity
        })
        // closeModal();
    }

    const validateQuantity = (e) => {
        let itemName = document.getElementById("itemNameField").value;
        let itemQuantity = document.getElementById("itemQuantityField").value;

        if (itemQuantity.trim().length > 0) {
            itemQuantity = parseInt(itemQuantity);
        }

        // make sure item name is not empty and values are in range 1-99
        // enable save button
        if (itemQuantity != null && itemName != null &&
            itemQuantity > 0 && itemQuantity < 100
            && itemName.trim().length > 0
        ) {
            setSaveButtonDisabled(false);
        }
        else {
            setSaveButtonDisabled(true);
        }
    }

    return (
        <Modal show={props.showModal} animation={false}
            onHide={() => closeModal()}
        >
            <Modal.Header closeButton>
                <Modal.Title>Register Item</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group>
                    <Form.Label>Enter Item Name</Form.Label>
                    <Form.Control id="itemNameField" type="textarea" placeholder="Item name" onChange={validateQuantity} />
                    <br />
                    <Form.Label>Enter Quantity</Form.Label>
                    <Form.Control id="itemQuantityField" type="number" placeholder="Quantity" onChange={validateQuantity} />
                    <Form.Text className="text-muted" > Valid quantities 1-99</Form.Text>

                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                {props.modalError &&
                    < p style={{ color: "red" }} >{props.modalError}</p>
                }
                <Button variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                <Button variant="primary" onClick={addItem} disabled={saveButtonDisabled}>
                    Add Item
                  </Button>
            </Modal.Footer>
        </Modal >
    );
}

export default AddModal;