import React, { useState, useEffect } from 'react';
import { GiExitDoor } from 'react-icons/gi';
import { FaAddressCard } from 'react-icons/fa';
import { BsBoxArrowRight } from 'react-icons/bs';

import './styles.css';
import api from '../../services/api';
import Header from '../../components/Header';
import person from '../../assets/person.png'

export default function Dashboard() {
	const [mensage, setMensage] = useState(null);
	const [visitors, setVisitors] = useState([]);
	const [rooms, setRooms] = useState([]);
	const [arrivals, setArrivals] = useState([]);
	const [queues, setQueues] = useState([]);

	const [selectedVisitor, setSelectedVisitor] = useState('0');
	const [selectedRoom, setSelectedRoom] = useState('0');




    useEffect(() => {
        api.get('visitors').then(res => {
            setVisitors(res.data)
        })
	}, []);
	
	useEffect(() => {
        api.get('rooms').then(res => {
            setRooms(res.data)
        })
	}, []);
	
	useEffect(() => {
		api.get('arrivals').then(res => {
			setArrivals(res.data)
		})
	}, []);
	
	useEffect(() => {
		api.get('queue').then(res => {
			setQueues(res.data)
		})
    }, []);






	function checkInput(e) {
		e.preventDefault();
	
		if (selectedVisitor === '0') return setMensage('Selecione um visitante!');
		if (selectedRoom === '0') return setMensage('Selecione uma sala!');
	
		handleSubmit();
	};







	function handleSelectVisitor(e) {
        const visitor = e.target.value;
        setSelectedVisitor(visitor);
	};
	
	function handleSelectRoom(e) {
        const room = e.target.value;
        setSelectedRoom(room);
    };







	async function handleSubmit() {
		const visitor = selectedVisitor.split(',');
		const room = selectedRoom.split(',');
		const dataTime = new Date().toLocaleString();

		const data = new FormData();
		data.append('visitor_id', visitor[0]);
        data.append('room_id', room[0]);
        data.append('checkIn', dataTime);

		const arrival = await api.post('arrivals', data);

		const nameVisitorAndNrRoom = [{
			name: visitor[1],
			nrRoom: room[1]
		}];

		Object.assign(arrival.data, nameVisitorAndNrRoom[0])

		setArrivals([ ...arrivals, arrival.data ]);
	}





	function handleCheckOut(id) {
		api.delete(`arrivals/${id}`);

        setArrivals(arrivals.filter(req => req.id !== id));
	};
	
	function handleExit(id) {
		api.delete(`arrivals/${id}`);

        setArrivals(arrivals.filter(req => req.id !== id));
    };	





	return	( 
		<>
			<Header />
			
			<div className="containerDashboard">
				<div className="contentMain">
					<div className="contentVisitors">
						<form onSubmit={checkInput}>
							<select 
								id="visitor" 
								name="visitor"
								value={selectedVisitor} 
								onChange={handleSelectVisitor}
							>
								<option value="0">Selecione um Visitante</option>
								{visitors.map(visitor => (
									<option key={visitor.id} value={[visitor.id, visitor.name]}>{visitor.name}</option>
								))}
							</select>

							<select 
								id="room" 
								name="room"
								value={selectedRoom} 
								onChange={handleSelectRoom}
							>
								<option value="0">Selecione uma Sala</option>
								{rooms.map(room => (
									<option key={room.id} value={[room.id, room.nrRoom]}>{room.nrRoom}</option>
								))}
							</select>

							<button className="btnCheckin" type="submit">
								<FaAddressCard size="26" title="CkeckIn" />
							</button>
						</form>
					</div>

					<div className="contentRooms">
						<ul>
						{arrivals.map(arrival => (
							<li className="cardPerson" key={arrival.id}>
								<span>
									<img src={person} title="Visitante" />
								</span>
								<footer>
									<strong>Sala {arrival.nrRoom}</strong>
									<p>{arrival.name}</p>
									<h6>{arrival.checkIn}</h6>
								</footer>
								<button className="btnCheckout" onClick={() => handleCheckOut(arrival.id)}>
									<BsBoxArrowRight size="26" title="CheckOut" />
								</button>
							</li>							
						))}
						</ul>
					</div>
				</div>

				<div className="contentQueues">
					<div>
						Fila de Espera
					</div>
					<div className="queuePerson">
						<ul>
							{queues.map(queue => (
								<li className="cardPerson" key={queue.id}>
									<span>
										<img src={person} alt="" />
									</span>
									<footer>
										<strong>Sala {queue.nrRoom}</strong>
										<p>{queue.name}</p>
										<h6>{queue.create_at}</h6>						
									</footer>
									<button className="btnCheckout" onClick={() => handleExit(queue.id)}>
										<GiExitDoor size="26" title="Exit" />
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
