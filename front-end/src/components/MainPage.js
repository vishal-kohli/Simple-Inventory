import React, { useState, useEffect } from 'react';
import { Button, Table } from "react-bootstrap";
import MainPage from "./MainPage.css"
import $ from 'jquery';

function App() {
    // const [items, setItems] = useState(null);
    const [toBeDeleted, setToBeDeleted] = useState([]);
    const retrieveListItems = () => {

        // make api call to get items

        // set data to state hook
    }
    const updateQuantity = () => {

        var selected = new Array();
        $('.ItemTable [type="checkbox"]').each(function (i, chk) {
            if (chk.checked) {
                selected.push(i);
            }
        });
        if (selected.length == 0) {
            alert("No items are selected.")
        }
    }


    // make api call to get the list of items
    useEffect(() => {
        retrieveListItems();
    }, []);

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
                {items.map(function (item) {
                    return <tr>
                        <td><input type="checkbox" /></td>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                    </tr>
                })}
            </tbody>
        </Table>
    );

    const items = [
        { name: 'nick', quantity: 0 },
        { name: 'asdasdasd', quantity: 0 },
        { name: 'asdasd', quantity: 0 },
        { name: 'nick', quantity: 0 },
        { name: 'nick', quantity: 0 },
        { name: 'nick', quantity: 0 }
    ];

    return (

        <div className="MainPageDiv">
            <div className="ButtonDiv">
                <Button onClick={updateQuantity} action="add" variant="success">Add Item</Button>
                <Button onClick={updateQuantity} action="delete" variant="danger">Delete Item</Button>
            </div>
            <ItemTable />
        </div>
    );
}

export default App;
