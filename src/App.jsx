import React from 'react';
import './App.css';
import {Alert, Button, Col, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import Horta from './components/horta';

class App extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            tamanho: '',
            inicio: '',
            orientacao: '',
            direcao: '',
            horta: false,
            canteiros: '',
            erros: [],
            alerta: false
        };
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            horta: false
        });
    };

    busca_par = (string: string) => { //Processa a string para retornar um par
        const regex = new RegExp('^\\(\\d*,\\d*\\)$');
        if (string.search(regex) > -1) {
            const divisor = string.search(',');
            const fim = string.search(new RegExp('\\)'));
            return {
                x: parseInt(string.substr(1, divisor - 1)),
                y: parseInt(string.substr(divisor + 1, fim - 1 - divisor))
            };
        } else {
            return null;
        }
    };

    valida_par = (par, tamanho, campo) => { // Valida o par se está dentro da tabela
        if (par === null) {
            this.state.erros.push('O ' + campo + ' não possui o formato correto de (X,Y)');
            return false;
        } else if (par.x < 0 || par.y < 0 || (tamanho !== null && (par.x > tamanho.x - 1 || par.y > tamanho.y - 1))) {
            this.state.erros.push('O ' + campo + ' está fora da área permitida');
            return false;
        }
        return true;
    };

    onClick = (event) => {
        const tamanho = this.busca_par(this.state.tamanho); // Tamanho da horta
        const inicio = this.busca_par(this.state.inicio); // Posição inicial
        if (tamanho === null) {
            this.state.erros.push('O tamanho não possui o formato correto de (X,Y)')
        } else if (tamanho.x < 0 || tamanho.y < 0) {
            this.state.erros.push('Tamanho não pode ser menor que 0');
        }

        this.valida_par(inicio, tamanho, 'inicio');

        const canteiros = this.state.canteiros.split(' '); // Separa os canteiros por espaço
        let par_canteiros = [];
        canteiros.forEach((canteiro) => {
            const par = this.busca_par(canteiro);
            if (this.valida_par(par, tamanho, 'canteiro')) {
                par_canteiros.push(par);
            }
        });

        let direcao;
        switch (this.state.direcao) { // Transforma a string em número
            case "N":
                direcao = 0;
                break;
            case "L":
                direcao = 270;
                break;
            case "S":
                direcao = 180;
                break;
            case "O":
                direcao = 90;
                break;
            default:
                this.state.erros.push('Direção inválida');
                break;
        }
        if (this.state.erros.length === 0) { //Se não tiver nenhum erro
            this.setState({
                horta: true,
                tamanho_horta: tamanho,
                inicio_horta: inicio,
                canteiros_horta: par_canteiros,
                direcao_horta: direcao,
                alerta: false,
                erros: []
            });
        } else {
            this.setState({
                alerta: true
            });
        }
    };

    onDismiss = () => { //Limpa os erros
        this.setState({
            alerta: false,
            erros: [],
        });
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Row>
                        <Alert color='danger' isOpen={this.state.alerta} toggle={this.onDismiss}>
                            <p>
                                Ocorreu o(s) seguinte(s) erro(s) ao validar a entrada:
                            </p>
                            <ul>
                                {
                                    this.state.erros.map((erro, index) => {
                                            return <li key={index}>
                                                {erro}
                                            </li>;
                                        }
                                    )
                                }
                            </ul>
                        </Alert>
                    </Row>
                    <Row>
                        <h3>
                            Horta
                        </h3>
                    </Row>
                    <Row>
                        <Form>
                            <FormGroup row={true}>
                                <Col>
                                    <Label for='tamanho'>Tamanho</Label>
                                    <Input type='text' name='tamanho' id='tamanho' placeholder='(X,Y)' size={'5'}
                                           onChange={this.onChange}/>
                                </Col>
                                <Col>
                                    <Label for='inicio'>Posição Inicial</Label>
                                    <Input type='text' name='inicio' id='inicio' placeholder='(X,Y)'
                                           onChange={this.onChange}/>
                                </Col>
                                <Col>
                                    <Label for='direcao'>Direção</Label>
                                    <Input type='text' name='direcao' id='direcao' placeholder='N'
                                           onChange={this.onChange}/>
                                </Col>
                                <Col>
                                    <Label for='canteiros'>Canteiros</Label>
                                    <Input type='text' name='canteiros' id='canteiros' placeholder='(X,Y) (X,Y)'
                                           onChange={this.onChange}/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Button color='success' onClick={this.onClick}>Enviar</Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Row>
                    <Row>
                        {this.state.horta ? <Horta inicio={this.state.inicio_horta} tamanho={this.state.tamanho_horta}
                                                   canteiros={this.state.canteiros_horta}
                                                   direcao={this.state.direcao_horta}/> : null}
                    </Row>
                </header>
            </div>
        );
    }
}

export default App;
