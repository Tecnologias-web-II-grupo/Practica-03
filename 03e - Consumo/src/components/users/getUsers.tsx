import React, {useEffect, useState} from "react";
import axios from 'axios';
import logo from "../../logo.svg";

const GetUsers = () => {

    const [data, setData] = useState([]);
    let result: any[];
    result = [];

    const Obtener = async () => {
        try {
            axios
                .get('http://localhost:5000/users')
                .then(response => {
                    const json = response.data;
                    setData(json.data);
                    console.log(json.data);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const convertir = () => {
        data.forEach((item, index) => {
            result.push(item);
        });
    }

    useEffect(() => {
        Obtener();

    }, []);

    useEffect(() => {
        convertir();
    }, [data]);

    return (
        <div>
            <h5>Consumiendo datos de un API-Rest</h5>
            <p>En este ejemplo se muestra como consumir datos de un API-Rest</p>
            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => {
                    return(<tr key={item['id']}>
                        <td>{item['id']}</td>
                        <td>{item['name']}</td>
                        <td>{item['email']}</td>
                        <img src={logo} width="40" height="40" alt="Logo de la empresa"/>
                    </tr>);
                })}
                </tbody>
            </table>
        </div>
    );
}
export default GetUsers;
