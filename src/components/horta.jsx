import React from 'react';
import {Table} from "reactstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLeaf, faRobot, faWater} from '@fortawesome/free-solid-svg-icons';

class Horta extends React.Component {
    constructor(props, context) {
        super(props, context);
        const {inicio, direcao, tamanho, canteiros} = props;
        const tabela = this.tabela(canteiros, inicio, tamanho, direcao);
        const cabecalho = this.monta_cabecalho(tamanho);
        this.state = {
            tabela: tabela,
            cabecalho: cabecalho,
            direcao: direcao,
            robo: inicio,
            canteiros: canteiros,
            tamanho: tamanho,
            movimentos: [],
            calculado: false
        };
    }

    componentDidMount(): void {
        setTimeout(this.traca_caminho, 1000);
    }

    tabela = (canteiros, robo, tamanho, direcao) => {
        let rows = [];
        for (let i = tamanho.y - 1; i >= 0; i--) {
            let items = [];
            for (let j = 0; j < tamanho.x; j++) {
                let icon = faWater;
                let rotation = 0;
                if (robo.x === j && robo.y === i) {
                    icon = faRobot;
                    rotation = direcao;
                } else {
                    canteiros = canteiros.filter((canteiro) => { //Remove o canteiro quando for a posição correta
                        if (canteiro.x === j && canteiro.y === i) {
                            icon = faLeaf;
                            return false;
                        }
                        return true;
                    });
                }
                if (rotation === 0) {
                    items.push(<td key={j}>
                        <FontAwesomeIcon icon={icon}/>
                    </td>);
                } else {
                    items.push(<td key={j}>
                        <FontAwesomeIcon icon={icon} rotation={rotation}/>
                    </td>);
                }
            }
            rows.push(<tr key={i}>
                <th>{i}</th>
                {items}
            </tr>);
        }
        return rows;
    };

    direita = (value) => {
        return value > 0 ? value - 90 : 270;
    };
    esquerda = (value) => {
        return value < 270 ? value + 90 : 0;
    };

    traca_caminho = () => {
        let posicao = this.state.robo;
        let canteiros = this.state.canteiros;
        let direcao = this.state.direcao;

        const rotaciona = function (destino, limite) {
            if (direcao > limite) {
                while (direcao !== destino) {
                    this.state.movimentos.push('E');
                    direcao = this.esquerda(direcao);
                }
            } else {
                while (direcao !== destino) {
                    this.state.movimentos.push('D');
                    direcao = this.direita(direcao);
                }
            }
        }.bind(this);

        canteiros.forEach((canteiro) => { //Para cada canteiro calcula a rotação e quantos passos necessita em X e Y
            if (posicao.x < canteiro.x) {
                rotaciona(270, 90);
                const offset = canteiro.x - posicao.x;
                posicao.x = canteiro.x;
                for (let i = 0; i < offset; i++) {
                    this.state.movimentos.push('M');
                }
            } else if (posicao.x > canteiro.x) {
                rotaciona(90, 270);
                const offset = posicao.x - canteiro.x;
                posicao.x = canteiro.x;
                for (let i = 0; i < offset; i++) {
                    this.state.movimentos.push('M');
                }
            }

            if (posicao.y < canteiro.y) {
                rotaciona(0, 180);
                const offset = canteiro.y - posicao.y;
                posicao.y = canteiro.y;
                for (let i = 0; i < offset; i++) {
                    this.state.movimentos.push('M');
                }
            } else if (posicao.y > canteiro.y) {
                rotaciona(180, 0);
                const offset = posicao.y - canteiro.y;
                posicao.y = canteiro.y;
                for (let i = 0; i < offset; i++) {
                    this.state.movimentos.push('M');
                }
            }
            this.state.movimentos.push('I'); // Irriga quando está em cima
        });
        switch (direcao) {
            case 0:
                direcao = 'N';
                break;
            case 90:
                direcao = 'O';
                break;
            case 180:
                direcao = 'S';
                break;
            case 270:
                direcao = 'L';
                break;
            default:
                break;
        }
        this.setState({
            calculado: true,
            direcao_final: direcao
        });
    };

    monta_cabecalho(tamanho) {
        const colunas = [];
        for (let i = 0; i < tamanho.x; i++) {
            colunas.push(<th key={i}>
                {i}
            </th>);
        }
        return colunas;
    }


    render() {
        return (
            <div>
                {this.state.calculado ? (<div>
                        <p>
                            Caminho: {this.state.movimentos.join(' ')}
                        </p>
                        <p>
                            Direção final: {this.state.direcao_final}
                        </p>
                    </div>
                ) : null
                }
                <Table bordered>
                    <thead>
                    <tr>
                        <th>%</th>
                        {this.state.cabecalho}
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.tabela}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Horta;
