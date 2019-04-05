import React, { Component } from 'react';
import {Form, Input, Button, Icon, Select, InputNumber, Tag, Tooltip, message, Modal, Upload, Rate} from 'antd';
import { Link } from 'react-router-dom'
import TextArea from 'antd/lib/input/TextArea';
import * as firebase from 'firebase';
import config from './config';

const Option = Select.Option;

class Add extends Component {

    state = {   inputVisible: false, inputMaterielVisible: false, inputIngredientVisible: false, inputPrepaVisible: false, recettes: [], 
                tags: [], materiel: [], ingredients: [], editing: false, id: 0, img: [], preparation: [],
                previewVisible: false, previewImage: '',
                fileList: [
                    {
                        nom: '',
                        url: '',
                        status: 'done',
                        uid: '-1'
                    }
                ]
            };

    saveInputRef = input => this.input = input
    saveInputRefMateriel = input => this.input = input;
    saveInputRefIngredient = input => this.input = input;
    saveInputRefPrepa = input => this.input = input;

    constructor(props) {
        super(props);
        if(!firebase.apps.length){
            firebase.initializeApp(config);
        }
        this.handleSubmit = this.handleSubmit.bind(this);

        this.showInput = this.showInput.bind(this);
        this.showInputMateriel = this.showInputMateriel.bind(this);
        this.showInputIngredient = this.showInputIngredient.bind(this);
        this.showInputPrepa = this.showInputPrepa.bind(this);

        this.handleInputConfirm = this.handleInputConfirm.bind(this);
        this.handleInputMaterielConfirm = this.handleInputMaterielConfirm.bind(this);
        this.handleInputIngredientConfirm = this.handleInputIngredientConfirm.bind(this);
        this.handleInputPrepaConfirm = this.handleInputPrepaConfirm.bind(this);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputMaterielChange = this.handleInputMaterielChange.bind(this);
        this.handleInputIngredientChange = this.handleInputIngredientChange.bind(this);
        this.handleInputPrepaChange = this.handleInputPrepaChange.bind(this);

        this.handleClose = this.handleClose.bind(this);
        this.handleCloseMateriel = this.handleCloseMateriel.bind(this);
        this.handleCloseIngredient = this.handleCloseIngredient.bind(this);
        this.handleClosePrepa = this.handleClosePrepa.bind(this);

        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);

        this.handleCancelImage = this.handleCancelImage.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        var choix = window.location.pathname.split("/")[1];
        if(choix === "edit") {
        var id = window.location.pathname.split("/")[2];
            this.setState({
                editing: true,
                id: id
            });
        }
    }

    componentDidMount() {
        if(this.state.editing){
            const ref = firebase.database().ref('Recettes/'+this.state.id);
            ref.on('value', snapshot => {
                this.setState({
                    recettes: snapshot.val(),
                    loading: false,
                    tags: snapshot.val().tags,
                    materiel: snapshot.val().materiel,
                    ingredients: snapshot.val().ingrédients,
                    fileList: snapshot.val().images,
                    preparation: snapshot.val().préparation
                });
            });
        }
        else {
            const ref = firebase.database().ref('Recettes');
            ref.on('value', snapshot => {
                this.setState({
                    recettes: snapshot.val(),
                    loading: false
                });
            });   
        }
    }

    showInput(){
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    showInputMateriel(){
        this.setState({ inputMaterielVisible: true }, () => this.input.focus());
    }

    showInputIngredient(){
        this.setState({ inputIngredientVisible: true }, () => this.input.focus());
    }

    showInputPrepa(){
        this.setState({ inputPrepaVisible: true }, () => this.input.focus());
    }

    handleInputChange= (e) => {
        this.setState({ inputValue: e.target.value });
    }

    handleInputMaterielChange= (e) => {
        this.setState({ inputMaterielValue: e.target.value });
    }

    handleInputIngredientChange= (e) => {
        this.setState({ inputIngredientValue: e.target.value });
    }

    handleInputPrepaChange= (e) => {
        this.setState({ inputPrepaValue: e.target.value });
    }

    handleInputConfirm(){
        const inputValue = this.state.inputValue;
        let tags = this.state.tags;

        if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
        }

        this.setState({
            tags,
            inputVisible: false
        });
      }

      handleInputMaterielConfirm(){
        const inputMaterielValue = this.state.inputMaterielValue;
        let materiel = this.state.materiel;

        if (inputMaterielValue && materiel.indexOf(inputMaterielValue) === -1) {
            materiel = [...materiel, inputMaterielValue];
        }

        this.setState({
            materiel,
            inputMaterielVisible: false
        });
      }

      handleInputIngredientConfirm(){
        const inputIngredientValue = this.state.inputIngredientValue;
        let ingredients = this.state.ingredients;

        if (inputIngredientValue && ingredients.indexOf(inputIngredientValue) === -1) {
            ingredients = [...ingredients, inputIngredientValue];
        }

        this.setState({
            ingredients,
            inputIngredientVisible: false
        });
      }

      handleInputPrepaConfirm(){
        const inputPrepaValue = this.state.inputPrepaValue;
        let preparation = this.state.preparation;

        if (inputPrepaValue && preparation.indexOf(inputPrepaValue) === -1) {
            preparation = [...preparation, inputPrepaValue];
        }

        this.setState({
            preparation,
            inputPrepaVisible: false
        });
      }
    
    handleClose = (removedItem) => {
        const tags = this.state.tags.filter(tag => tag !== removedItem);
        this.setState({ tags });
    }

    handleCloseMateriel = (removedItem) => {
        const materiel = this.state.materiel.filter(materiel => materiel !== removedItem);
        this.setState({ materiel });
    }

    handleCloseIngredient = (removedItem) => {
        const ingredients = this.state.ingredients.filter(ingredient => ingredient !== removedItem);
        this.setState({ ingredients });
    }

    handleClosePrepa = (removedItem) => {
        const preparation = this.state.preparation.filter(prepa => prepa !== removedItem);
        this.setState({ preparation });
    }

    handleCancelImage = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => this.setState({ fileList })

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
          if (!err) {                                       //Si pas d'erreurs
            var newId = 0;
            this.state.editing ? this.state.recettes !== null ? newId = this.state.id : newId = this.state.recettes.slice(-1)[0].id+1 : newId = 0;

            var img = [];
            for(var i = 0; i<this.state.fileList.length; i++){
                var temp = new Object();
                    temp["uid"] = this.state.fileList[i].uid;
                    temp["name"] = this.state.fileList[i].name;
                    temp["status"] = this.state.fileList[i].status;
                    temp["thumbUrl"] = this.state.fileList[i].thumbUrl;

                img[i] = temp;
            }
            var data = 
                    {   "commentaire": values.comment, 
                        "difficulté": values.difficulté, 
                        "id": parseInt(newId), 
                        "images": img,
                        "ingrédients":this.state.ingredients,
                        "materiel": this.state.materiel,
                        "nb_pers": values.nb_pers, 
                        "nom":values.name,
                        "tags":this.state.tags,
                        "préparation": this.state.preparation,
                        "temps_cuisson": values.tps_cuisson,
                        "temps_prep": values.tps_prep,
                        "type": values.type
                    };

           if(this.state.editing){
                const edit = firebase.database().ref('Recettes/'+newId);
                edit.set(data).then(() => {
                    message.success("La recette a été modifiée avec succès");
                    window.location = "/"; // Succès !
                    }, () => {
                    message.error("Erreur lors de la modification de la recette"); // Erreur !
                  });
            }
            else {
                const add = firebase.database().ref('Recettes/'+newId);
                add.set(data).then(() => {
                    message.success("La recette a été ajoutée avec succès");
                    window.location = "/"; // Succès !
                    }, () => {
                    message.error("Erreur lors de l'ajout de la recette"); // Erreur !
                  });
            }
        }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
        );
        
        if(!this.state.loading) {

            return (
                <Form onSubmit={this.handleSubmit} className="container">
                     <div className="clearfix">
                        {this.state.editing ?
                            <Form.Item label="Image">
                            {getFieldDecorator('image', {
                                rules: [{ required: this.state.fileList.length >=2 ? false : true, message: 'Veuillez selectionner une image' }],
                            })(
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                    >
                                    {fileList.length >= 2 ? null : uploadButton}
                                </Upload>
                            )}
                            </Form.Item>
                        :
                            
                            <Form.Item label="Image">
                            {getFieldDecorator('image', {
                                rules: [{ required: this.state.fileList.length >=2 ? false : true, message: 'Veuillez selectionner une image' }],
                            })(
                                <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    onPreview={this.handlePreview}
                                    onChange={this.handleChange}
                                    >
                                    {fileList.length >= 2 ? null : uploadButton}
                                </Upload>
                            )}
                            </Form.Item>
                        }
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelImage}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </div>
                    {this.state.editing ?
                    
                        <Form.Item label="Type">
                        {getFieldDecorator('type', {
                            initialValue: this.state.recettes.type !== null ? this.state.recettes.type : null,
                            rules: [{ required: true, message: 'Veuillez selectionner un type' }],
                        })(
                            <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Selectionnez un type"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value="Classique">Classique</Option>
                        </Select>
                        )}
                        </Form.Item>
                    :

                        <Form.Item label="Type">
                        {getFieldDecorator('type', {
                            rules: [{ required: true, message: 'Veuillez selectionner un type' }],
                        })(
                            <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Selectionnez un type"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value="Classique">Classique</Option>
                        </Select>
                        )}
                        </Form.Item>
                    }

                    {this.state.editing ?
                    
                        <Form.Item label="Nom">
                        {getFieldDecorator('name', {
                           initialValue: this.state.recettes.nom !== null ? this.state.recettes.nom : null,
                            rules: [{ required: true, message: 'Veuillez entrer un nom' }],
                        })(
                            <Input style={{width: '600px'}} placeholder="Nom" />
                        )}
                        </Form.Item>
                    :

                        <Form.Item label="Nom">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Veuillez entrer un nom' }],
                        })(
                            <Input style={{width: '600px'}} placeholder="Nom" />
                        )}
                        </Form.Item>
                    }
                    <div className="inline">
                    
                    {this.state.editing ?
            
                        <Form.Item label="Temps de préparation (en minutes)">
                        {getFieldDecorator('tps_prep', {
                            initialValue: this.state.recettes.temps_prep !== null ? this.state.recettes.temps_prep : null,
                            rules: [{ required: true, message: 'Veuillez entrer un temps de préparation' }],
                        })(
                            <InputNumber min={1} />,
                        )}
                        </Form.Item>
                
                    :

                        <Form.Item label="Temps de préparation (en minutes)">
                        {getFieldDecorator('tps_prep', {
                            rules: [{ required: true, message: 'Veuillez entrer un temps de préparation' }],
                        })(
                            <InputNumber min={1} />,
                        )}
                        </Form.Item>
                    
                    }
                    {this.state.editing ?
                        
                        <Form.Item label="Temps de cuisson (en minutes)">
                        {getFieldDecorator('tps_cuisson', {
                            initialValue: this.state.recettes.temps_cuisson !== null ? this.state.recettes.temps_cuisson : null,
                            rules: [{ required: true, message: 'Veuillez entrer un temps de cuisson' }],
                        })(
                            <InputNumber min={0} />,
                        )}
                        </Form.Item>
                    
                    :

                        <Form.Item label="Temps de cuisson (en minutes)">
                        {getFieldDecorator('tps_cuisson', {
                            rules: [{ required: true, message: 'Veuillez entrer un temps de cuisson' }],
                        })(
                            <InputNumber  min={0} />,
                        )}
                        </Form.Item>
                        
                    }
                    {this.state.editing ?
                        
                        <Form.Item label="Difficulté note de 1 à 5">
                        {getFieldDecorator('difficulté', {
                            initialValue: this.state.recettes.difficulté !== null ? this.state.recettes.difficulté : null,
                            rules: [{ required: true, message: 'Veuillez renseigner la difficulté (1 -> 5)' }],
                        })(
                            <Rate character={<Icon type="bg-colors" />} />,
                        )}
                        </Form.Item>
                    
                    :

                        <Form.Item label="Difficulté : notée de 1 à 5">
                        {getFieldDecorator('difficulté', {
                            rules: [{ required: true, message: 'Veuillez renseigner la difficulté (1 -> 5)' }],
                        })(
                            <Rate character={<Icon type="bg-colors" />} />
                        )}
                        </Form.Item>
                        
                    }
                    {this.state.editing ?
                        
                        <Form.Item label="Nombre de personnes pour la recette de base">
                        {getFieldDecorator('nb_pers', {
                            initialValue: this.state.recettes.nb_pers !== null ? this.state.recettes.nb_pers : null,
                            rules: [{ required: true, message: 'Le nombre de personne pour la recette de base est requis' }],
                        })(
                            <InputNumber min={1} />,
                        )}
                        </Form.Item>
                    
                    :

                        <Form.Item label="Nombre de personnes pour la recette de base">
                        {getFieldDecorator('nb_pers', {
                            rules: [{ required: true, message: 'Le nombre de personne pour la recette de base est requis' }],
                        })(
                            <InputNumber min={1} />,
                        )}
                        </Form.Item>
                        
                    }</div>

                        <Form.Item label="Tags">
                        {getFieldDecorator('tags', {
                            rules: [{ required: this.state.tags.length !== 0 ? false : true, message: 'Veuillez ajouter au moins 1 Tag' }],
                        })(
                            <div>
                                {this.state.tags.map((tag) => {
                                const isLongTag = tag.length > 20;
                                const tagElem = (
                                    <Tag style={{ color:"#ED125E", backgroundColor: "#FFF9C5"}}  key={tag} closable={true} afterClose={() => this.handleClose(tag)}>
                                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                    </Tag>
                                );
                                return isLongTag ? <Tooltip title={tag} key={tag} >{tagElem}</Tooltip> : tagElem;
                                })}
                                {this.state.inputVisible && (
                                <Input
                                    ref={this.saveInputRef}
                                    type="text"
                                    size="small"
                                    style={{ width: 78 }}
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleInputConfirm}
                                    onPressEnter={this.handleInputConfirm}
                                />
                                )}
                                {!this.state.inputVisible && (
                                <Tag
                                    onClick={this.showInput}
                                    style={{ background: '#fff', borderStyle: 'dashed' }}
                                >
                                    <Icon type="plus" /> Ajouter un tag
                                </Tag>
                                )}
                            </div>,
                        )}
                        </Form.Item>

                        <Form.Item label="Materiel">
                        {getFieldDecorator('materiel', {
                            rules: [{ required: this.state.materiel.length !== 0 ? false : true, message: 'Veuillez ajouter au moins 1 élement materiel' }],
                        })(
                            <div>
                                {this.state.materiel.map((materiel) => {
                                const isLongMateriel = materiel.length > 20;
                                const materielElem = (
                                    <Tag  style={{ color:"#ED125E", backgroundColor: "#FFF9C5"}} key={materiel} closable={true} afterClose={() => this.handleCloseMateriel(materiel)}>
                                    {isLongMateriel ? `${materiel.slice(0, 20)}...` : materiel}
                                    </Tag>
                                );
                                return isLongMateriel ? <Tooltip title={materiel} key={materiel}>{materielElem}</Tooltip> : materielElem;
                                })}
                                {this.state.inputMaterielVisible && (
                                <Input
                                    ref={this.saveInputRefMateriel}
                                    type="text"
                                    size="small"
                                    style={{ width: 78 }}
                                    onChange={this.handleInputMaterielChange}
                                    onBlur={this.handleInputMaterielConfirm}
                                    onPressEnter={this.handleInputMaterielConfirm}
                                />
                                )}
                                {!this.state.inputMaterielVisible && (
                                <Tag
                                    onClick={this.showInputMateriel}
                                    style={{ background: '#fff', borderStyle: 'dashed' }}
                                >
                                    <Icon type="plus" /> Ajouter du materiel
                                </Tag>
                                )}
                            </div>,
                        )}
                        </Form.Item>

                        <Form.Item label="Ingrédients">
                        {getFieldDecorator('ingredients', {
                            rules: [{ required: this.state.ingredients.length !== 0 ? false : true, message: 'Veuillez ajouter au moins 1 ingrédient' }],
                        })(
                            <div>
                                {this.state.ingredients.map((ingredient) => {
                                const isLongIngredient = ingredient.length > 20;
                                const ingredientElem = (
                                    <Tag style={{ color:"#ED125E", backgroundColor: "#FFF9C5"}}  key={ingredient} closable={true} afterClose={() => this.handleCloseIngredient(ingredient)}>
                                    {isLongIngredient ? `${ingredient.slice(0, 20)}...` : ingredient}
                                    </Tag>
                                );
                                return isLongIngredient ? <Tooltip title={ingredient} key={ingredient}>{ingredientElem}</Tooltip> : ingredientElem;
                                })}
                                {this.state.inputIngredientVisible && (
                                <Input
                                    ref={this.saveInputRefIngredient}
                                    type="text"
                                    size="small"
                                    style={{ width: 78 }}
                                    onChange={this.handleInputIngredientChange}
                                    onBlur={this.handleInputIngredientConfirm}
                                    onPressEnter={this.handleInputIngredientConfirm}
                                />
                                )}
                                {!this.state.inputIngredientVisible && (
                                <Tag
                                    onClick={this.showInputIngredient}
                                    style={{ background: '#fff', borderStyle: 'dashed' }}
                                >
                                    <Icon type="plus" /> Ajouter un ingrédient
                                </Tag>
                                )}
                            </div>,
                        )}
                        </Form.Item>

                        <Form.Item label="Préparation">
                        {getFieldDecorator('preparation', {
                            rules: [{ required: this.state.preparation.length !== 0 ? false : true, message: 'Veuillez ajouter au moins 1 étape' }],
                        })(
                            <div>
                                {this.state.preparation.map((prepa) => {
                                const isLongPrepa = prepa.length > 20;
                                const prepaElem = (
                                    <Tag style={{ color:"#ED125E", backgroundColor: "#FFF9C5"}}  key={prepa} closable={true} afterClose={() => this.handleClosePrepa(prepa)}>
                                    {isLongPrepa ? `${prepa.slice(0, 20)}...` : prepa}
                                    </Tag>
                                );
                                return isLongPrepa ? <Tooltip title={prepa} key={prepa}>{prepaElem}</Tooltip> : prepaElem;
                                })}
                                {this.state.inputPrepaVisible && (
                                <Input
                                    ref={this.saveInputRefPrepa}
                                    type="text"
                                    size="small"
                                    style={{ width: 78 }}
                                    onChange={this.handleInputPrepaChange}
                                    onBlur={this.handleInputPrepaConfirm}
                                    onPressEnter={this.handleInputPrepaConfirm}
                                />
                                )}
                                {!this.state.inputPrepaVisible && (
                                <Tag
                                    onClick={this.showInputPrepa}
                                    style={{ background: '#fff', borderStyle: 'dashed' }}
                                >
                                    <Icon type="plus" /> Ajouter une étape
                                </Tag>
                                )}
                            </div>,
                        )}
                        </Form.Item>

    
                    {this.state.editing ?
                    
                        <Form.Item label="Astuces / Commentaire">
                        {getFieldDecorator('comment', {
                            initialValue: this.state.recettes.commentaire !== null ? this.state.recettes.commentaire : null,
                            rules: [{ required: true, message: 'Veuillez entrer une astuce / un commentaire' }],
                        })(
                            <TextArea style={{width: '900px'}} prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)'}} />}/>
                        )}
                        </Form.Item>
                
                    :

                        <Form.Item label="Astuces / Commentaire">
                        {getFieldDecorator('comment', {
                            rules: [{ required: true, message: 'Veuillez entrer une astuce / un commentaire' }],
                        })(
                            <TextArea style={{width: '900px'}} prefix={<Icon type="form" style={{ color: 'rgba(0,0,0,.25)'}} />}/>
                        )}
                        </Form.Item>
                    
                    }

                    {this.state.editing ? 
                        <Button type="primary" htmlType="submit"><Icon type="save" />Modifier</Button>
                    : 
                        <Button type="primary" htmlType="submit"><Icon type="save" />Ajouter</Button> 
                    } 

                    <Link to={`/`}>
                        <Button onClick={this.handleCancel} style={{marginLeft: '20px'}} type="default"> Annuler <Icon type="close" /></Button>                
                    </Link>

                </Form>
            );
        }
    }
}

const AddItem = Form.create()(Add)

export default AddItem;