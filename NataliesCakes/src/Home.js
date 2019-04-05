import React, { Component } from 'react';
import { Table, Divider, Button, Icon, Modal, Tag, message, Input } from 'antd';
import { Link } from 'react-router-dom'
import * as firebase from 'firebase';
import config from './config';
const Search = Input.Search;

class Home extends Component {

    constructor(props) {
        super(props);
        if(!firebase.apps.length){
            firebase.initializeApp(config);
        }

        this.state = {
            loading: true,
            deleting: false,
            nom: "",
            recettes : [],
            recettesBaseSearch: [],
            id: 0
        }

        this.componentWillMount = this.componentWillMount.bind(this);
        this.delete = this.delete.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentWillMount() {
        var test = [];
        const ref = firebase.database().ref('Recettes');
        ref.on('value', snapshot => {
            test = snapshot.val();
                if(test !== null) {
                    for (var i = 0; i<test.length; i++) {
                        if(test[i] === undefined) {
                            test.splice(i, 1)
                        }
                    }
                }
            this.setState({
                recettes: test,
                recettesBaseSearch: test,
                loading: false
            });
        });
    }

    delete(record) {
        this.setState({
            deleting: true,
            nom: record.nom,
            id: record.id
        });
    }

    handleDelete() {
        return firebase.database().ref('Recettes').child(this.state.id).remove()
        .then(() => {
            this.setState({
                deleting: false,
            });
            message.success("La recette a été supprimée avec succès"); // Succès !
            }, () => {
            message.error("Erreur lors de la suppression de la recette"); // Erreur !
        });
    }

    handleCancel() {
        this.setState({
            deleting: false
        });
    }

    handleOnChange = (e) => {
        var listSearched = this.state.recettes.filter(item => item.nom.toLowerCase() === e.target.value.toLowerCase());

        if(listSearched.length === 0) {
            listSearched = this.state.recettes.filter(item => item.nom.toLowerCase().match(e.target.value.toLowerCase()));
        }

        if(e.target.value === "") {
            this.setState({
                recettes: this.state.recettesBaseSearch
            });
        }
        else {
            this.setState({
                recettes: listSearched
            });
        }
    }

    render() {

        const columns = [
            {
                title: 'Images',
                dataIndex: 'images',
                key: 'img',
                render: (text, record) => (
                    <img style={{width: 150, height: 100}} src={record.images[0].thumbUrl} key={record.images[0].name}/>
                )
            },
            {
                title: 'Nom',
                dataIndex: 'nom',
                key: 'name',
            },
            { 
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
            },
            { 
                title: 'Tags',
                dataIndex: 'tags',
                key: 'tags',
                render: (text, record) => (
                    record.tags.map(function(item, i){
                        return <Tag color="blue" key={i}>{item}</Tag>
                      })
                  )
            },
            {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                    <span>
                    <Link to={`/edit/${record.id}`}><Button type="primary"><Icon type="edit" />Modifier</Button></Link>
                    <Divider type="vertical" />
                    <Button type="danger" onClick={()=>this.delete(record)}>Supprimer<Icon type="delete" /></Button>
                    </span>
                ),
            }
        ];

        
        
        if(this.state.loading) {
            return(
                <div className="container">
                    <h1>Chargement</h1>
                </div>
            );
        }
        if(this.state.deleting) {
            return(
                <div className="container">
                    <Search
                        placeholder="Recherche..."
                        style={{ width: 500, marginLeft: 450, height: 40, marginTop: 50, marginBottom: 50 }}
                    />
                    <Table pagination= { {pageSizeOptions: ['5', '10'], showSizeChanger: true, pageSize: 5}} columns={columns} 
                    dataSource={this.state.recettes!== null ? this.state.recettes.length <= 1 ? this.state.recettes : this.state.recettes.reverse() : null} />
                    <Modal
                        title={`Suppression - ${this.state.nom}`}
                        visible={this.state.deleting}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="submit" type="danger" onClick={this.handleDelete}>Supprimer</Button>,
                            <Button key="back" type="default" onClick={this.handleCancel}>Annuler</Button>
                          ]}
                    >
                        <p>Êtes vous sur de vouloir supprimer la recette suivante : {this.state.nom}?</p>
                    </Modal>
                </div>
            );
        }
        return(
            <div className="container">
                <Search
                        placeholder="Recherche..."
                        onChange={this.handleOnChange}
                        style={{ width: 500, marginLeft: 420, height: 40, marginTop: 50, marginBottom: 50 }}
                />
                <Table pagination= { {pageSizeOptions: ['5', '10'], showSizeChanger: true, pageSize: 5}} columns={columns} 
                dataSource={this.state.recettes!== null ? this.state.recettes.length <= 1 ? this.state.recettes : this.state.recettes.reverse() : null} />
            </div>
        );
    }
}

export default Home;