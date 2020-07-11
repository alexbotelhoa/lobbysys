import React, { useState, useEffect }  from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FiSave } from 'react-icons/fi';
import Cookies from 'js-cookie';

import './styles.css';
import api from '../../services/api';
import loading from '../../assets/loading.gif'

export default function Rooms() {
	const [chargeRooms, setChargeRooms] = useState(true);

	const [mensage, setMensage] = useState(null);
	const [rooms, setRooms] = useState([]);

	const [inputRoom, setInputRoom] = useState('');

	useEffect(() => {
        api.get('rooms', {
			headers: {
			  Authorization: `Bearer ${Cookies.get('token')}`
			}
		}).then(response => {
            setRooms(response.data)
        }).finally(() => setChargeRooms(null));
	}, []);

	function checkInputsForm(event) {	
		event.preventDefault();

		if (inputRoom === "") return setMensage('Informe o número da sala!');
		
		createRoom();
	};

	async function createRoom() {
		const data = new FormData();
		data.append('nrRoom', inputRoom);
		
		try {
			const room = await api.post('rooms', data, {
				headers: {
				  Authorization: `Bearer ${Cookies.get('token')}`
				}
			});

			if (room.status === 201) {
				setRooms([ room.data, ...rooms ]);
			} else {
				if (room.status === 226) return setMensage('Sala já se encontra cadastrada!');
			}
		} catch (err) {
			alert('Erro ao tentar ADICIONAR a sala!\nVerifique se a mesma já não está cadastrada.\nCaso não, tente novamente em alguns instantes!');
		}	
	}

	async function handleDeleteRoom(id) {
        try {
            await api.delete(`/rooms/${id}`, {
				headers: {
				  Authorization: `Bearer ${Cookies.get('token')}`
				}
			});
        
            setRooms(rooms.filter(room => room.id !== id));
        } catch (err) {
			alert('Erro ao tentar DELETAR a sala!\nVerifique se a sala contém registro(s) de "checkin".\nCaso não tenha, tente novamente em alguns instantes!');
        }
	};

    return	( 
		<>
			<div className="container">
				<div className="contentMain">
					<div className="contentRoom">
						<form onSubmit={checkInputsForm}>
							<div className="field-group">
								<div className="field">
									<label htmlFor="nrRoom">Número da Sala * (Máx. 4 dígitos)</label>
									<input 
										data-testid="nrRoom" 
										name="nrRoom"
										type="text"
										maxLength="4"
										placeholder="Informe o NÚMERO da sala"
										value={inputRoom}
										onChange={e => setInputRoom(e.target.value)}
									/>
								</div>
								<div className="btnSalveRoom">	
									<span>
										<FiSave size="26" title="Nova Sala" />
									</span>
									<button data-testid="btnSalveRoom" type="submit" onClick={() => {}}>
										<strong>Cadastrar nova sala</strong>
									</button>
								</div>	
							</div>
						</form>
					</div>

					<div className="contentRooms">
						{ chargeRooms && (
							<div className="contentLoading">
								<img src={loading} width="120px" alt="" />
							</div>
						) }
						<ul>
							{rooms.map(room => (
								<li key={room.id}>
									<header>{room.nrRoom}</header>
									<button data-testid="btnDeleteRoom" onClick={() => handleDeleteRoom(room.id)}>
										<RiDeleteBinLine size="16" />
									</button>
								</li>
							))}							
						</ul>
					</div>
				</div>
			</div>

			{ mensage && (
			<div className="validation-container">
				<strong className="mensageError">{mensage}</strong>
				<button type="button" onClick={() => setMensage(null)}>FECHAR</button>
			</div>
			) }
		</>
	)
}
