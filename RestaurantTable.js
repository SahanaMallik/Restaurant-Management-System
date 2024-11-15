import { useState, useEffect } from 'react';
import axios from 'axios';
const RestaurantTable = () => {
    const [Restaurants, setRestaurants] = useState([]);
    const [editRecord, setEditRecord] = useState(null);
    const [form, setForm] = useState({
        id: 0, name: '', type: '',
        location: '', rating: '', topfood: ''
    });


    //Fetch the data from API.
    useEffect(() => {
        fetchRestaurants()
    }, []);




    //Gets the list of Restaurants from the backend (Express --> Mongoose --> MongoDB)
    const fetchRestaurants = async () => {
        try {
            const response = await axios.get("http://localhost:8001/getAllRestaurants");
            console.log(response.data);
            setRestaurants(response.data);
        } catch (error) {
            console.error("Error fetching Restaurants..", error);
        }
    }
    const handleDelete = async (id) => {
        await axios.delete("http://localhost:8001/deleteRecord/" + id);
        fetchRestaurants();
    }
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }


    //Setting the Edit record field..
    const handleEdit = (form) => {
        setForm(form);
        setEditRecord(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form data:", form); // Debugging line
        try {
            if (editRecord) {
                await axios.put(`http://localhost:8001/updateRestaurant/${form.id}`, form);
            } else {
                await axios.post("http://localhost:8001/insertData", form);
            }
            setForm({ id: "", name: "", type: "", location: "", rating: "", topfood: "" });
            setEditRecord(false);
            fetchRestaurants();
        } catch (error) {
            console.error("Error submitting form:", error.response?.data || error.message);
        }
    };
    



    return (
        <div>
            <h3> Restaurants List...</h3>
            <table border={1} cellPadding={10}>
                <thead>
                    <tr>
                        <th> ID </th>
                        <th> Name </th>
                        <th> Type </th>

                        <th> Location </th>
                        <th> Rating </th>
                        <th> Topfood </th>
                        <th> Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Restaurants.map((Restaurant) => (
                        <tr key={Restaurant.id}>
                            <td>{Restaurant.id}</td>
                            <td>{Restaurant.name}</td>
                            <td>{Restaurant.type}</td>

                            <td>{Restaurant.location}</td>
                            <td>{Restaurant.rating}</td>
                            <td>{Restaurant.topfood}</td>
                            <td>
                                <button onClick={() => handleEdit(Restaurant)}>Edit</button>
                                <button onClick={() => handleDelete(Restaurant.id)}>Delete</button>


                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br /><br /><br /><br /><b4 /><br />
            <div id="first">

                <h2> Form to update or add record...</h2>
                <form onSubmit={handleSubmit}>


                    Id :  <input name='id' value={form.id} onChange={handleChange} /> <br /><br />
                    Name :  <input name='name' value={form.name} onChange={handleChange} /><br /><br />
                    Type :  <input name='type' value={form.type} onChange={handleChange} /><br /><br />

                    Location :  <input name='location' value={form.location} onChange={handleChange} /> &nbsp;<br /><br />
                    Rating: <input name='rating' value={form.rating} onChange={handleChange} /><br /><br />
                    Topfood: <input name='topfood' value={form.topfood} onChange={handleChange} /><br /><br />
                    <button type='submit'>{editRecord ? 'Update' : 'Add'} Record </button>
                </form>
            </div>



        </div>
    );
}


export default RestaurantTable;