import React, { useState, useEffect } from 'react';
import { Button, Table } from "react-bootstrap";
import "./MainPage.css";
import AddModal from "./AddModal";
import $ from 'jquery';

function MainPage() {
    const [showModal, setShowModal] = useState(false);
    const [modalError, setModalError] = useState(null);
    const [checkBoxDisabled, setCheckBoxDisabled] = useState(false);
    const [items, setItems] = useState(null);

    const getData = () => {
        // fetch('http://localhost:3002/api/getInventory')
        fetch('api/Get/getInventory')
            // fetch('get_inventory_server:3002')
            .then(response => {
                return response.json()
            }).then(res => {

                if (res.error != null) {
                    console.log(res.error);
                }
                else {
                    console.log(res.data);
                    setItems(res.data);
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getData();

    }, []);

    const addItemsToInventory = (data) => {

        data = JSON.stringify(data);
        // fetch('http://localhost:3001/api/add'
        fetch('api/addDelete/add'
            // fetch('add_delete_server'
            , {
                method: 'post',
                body: data,
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
            }).then(response => {
                return response.json()
            }).then(res => {
                // if (res.error.code != null && res.error.code.toString() === 'ER_DUP_ENTRY') {
                //     setModalError("Item already exists");
                // }
                if (res.error != null) {
                    setModalError("Something went wrong. Try again.");
                    getData();
                }
                else {
                    setModalError(null);
                    setShowModal(false);
                    getData();
                }

            }).catch((error) => {
                setModalError("Something went wrong. Try again.");
                getData();
            });
    }

    const deleteItemsFromInventory = (data) => {
        // call api to get results
        data = JSON.stringify(data);
        // fetch('http://localhost:3001/api/delete', {
        fetch('api/addDelete/delete', {
            method: 'post',
            body: data,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            return response.json()
        }).then(res => {

            if (res.error != null) {
                setModalError("Something went wrong. Try again.");
                getData();
            }
            else {
                setShowModal(false);
                getData();
            }

        }).catch((error) => {
            setModalError("Something went wrong. Try again.");
            getData();
        });
    }



    const DeleteItem = (e) => {
        setCheckBoxDisabled(true);
        var selected = [];
        $('.ItemTable [type="checkbox"]').each(function (i, chk) {
            if (chk.checked) {
                selected.push(items[i]);
            }
        });
        if (selected.length === 0) {
            alert("No items are selected.")
        }
        else {
            // make api call to get updated list of results
            deleteItemsFromInventory(selected);
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
                {
                    items.map(function (item, i = 0) {
                        return <tr>
                            <td><input type="checkbox" disabled={checkBoxDisabled} value={i++} /></td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    })

                }
            </tbody>
        </Table>

    );

    return (

        <div className="MainPageDiv">
            <div className="ButtonDiv">
                <Button onClick={() => { setShowModal(true) }} action="add" variant="success">Add Item</Button>
                <Button onClick={DeleteItem} action="delete" variant="danger">Delete Item</Button>
            </div>
            <AddModal setModalError={setModalError} modalError={modalError} showModal={showModal} setShowModal={setShowModal} addItemsToInventory={addItemsToInventory} />
            {items &&
                <ItemTable />
            }
        </div>
    );
}

export default MainPage;
