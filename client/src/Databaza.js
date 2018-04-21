import React, {Component} from 'react';
import Modal from 'react-modal';

export default class Databaza extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        let self = this;
        fetch('/users', {
            method: 'GET'
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
            self.setState({users: data});
        }).catch(err => {
        console.log('caught it!',err);
        })
    }

    render() {
        return (
        <div className="table"> 
            <div className="panel panel-default p50 uth-panel">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Eemail</th>
                            <th>Blood Group</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.users.map(member =>
                        <tr key={member.id}>
                        <td>{member.name} </td>
                        <td>{member.email}</td>
                        <td>{member.bloodGroup}</td>
                        <td>{member.phone_number}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
        );
    }
}