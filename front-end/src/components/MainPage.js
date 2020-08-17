import React, { useState } from 'react';
import { Button, Table } from "react-bootstrap";
import "./MainPage.css";
import AddModal from "./AddModal";
import $ from 'jquery';

function MainPage() {
    const [showModal, setShowModal] = useState(false);
    const [checkBoxDisabled, setCheckBoxDisabled] = useState(false);

    const items = [
        { name: 'nick', quantity: 0 },
        { name: 'asdasdasd', quantity: 0 },
        { name: 'asdasd', quantity: 0 },
        { name: 'nick', quantity: 0 },
        { name: 'nick', quantity: 0 },
        { name: 'nick', quantity: 0 }
    ];

    const retrieveResults = () => {
        alert("here");
    }

    const AddItem = (e) => {
        setShowModal(true);
    }
    const DeleteItem = (e) => {
        setCheckBoxDisabled(true);
        var selected = [];
        $('.ItemTable [type="checkbox"]').each(function (i, chk) {
            if (chk.checked) {
                selected.push(i);
            }
        });
        if (selected.length === 0) {
            alert("No items are selected.")
        }
        else {
            // make api call to get updated list of results
            retrieveResults();
        }
        // enable check box again
        setCheckBoxDisabled(false);
    }

    // 
    const ItemTable = () => (
        <Table striped bordered hover size="sm" className="ItemTable" >
            <thead>
                <tr>
                    <th></th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                {items.map(function (item, i = 0) {
                    return <tr>
                        <td><input type="checkbox" disabled={checkBoxDisabled} value={i++} /></td>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                    </tr>
                })}
            </tbody>
        </Table>
    );

    return (

        <div className="MainPageDiv">
            <div className="ButtonDiv">
                <Button onClick={AddItem} action="add" variant="success">Add Item</Button>
                <Button onClick={DeleteItem} action="delete" variant="danger">Delete Item</Button>
            </div>
            <AddModal showModal={showModal} setShowModal={setShowModal} />
            <ItemTable />
        </div>
    );
}

export default MainPage;
