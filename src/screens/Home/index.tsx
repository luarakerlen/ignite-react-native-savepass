import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
	Container,
	Metadata,
	Title,
	TotalPassCount,
	LoginList,
} from './styles';

interface LoginDataProps {
	id: string;
	service_name: string;
	email: string;
	password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
	const [searchText, setSearchText] = useState('');
	const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
	const [data, setData] = useState<LoginListDataProps>([]);

	async function loadData() {
		const dataKey = '@savepass:logins';
		// Get asyncStorage data, use setSearchListData and setData
		const dataStored = await AsyncStorage.getItem(dataKey);
		if (dataStored) {
			setData(JSON.parse(dataStored));
			setSearchListData(JSON.parse(dataStored));
		}
	}

	function handleFilterLoginData() {
		// Filter results inside data, save with setSearchListData
		if (searchText !== '') {
      const searchListDataFiltered = searchListData.filter(item => item.service_name === searchText);
      setSearchListData(searchListDataFiltered);
		}
	}

	function handleChangeInputText(text: string) {
		// Update searchText value
		setSearchText(text);
		if (text === '') {
			setSearchListData(data);
		}
	}

	useFocusEffect(
		useCallback(() => {
			loadData();
		}, [])
	);

	return (
		<>
			<Header
				user={{
					name: 'Rocketseat',
					avatar_url: 'https://i.ibb.co/ZmFHZDM/rocketseat.jpg',
				}}
			/>
			<Container>
				<SearchBar
					placeholder='Qual senha você procura?'
					onChangeText={handleChangeInputText}
					value={searchText}
					returnKeyType='search'
					onSubmitEditing={handleFilterLoginData}
					onSearchButtonPress={handleFilterLoginData}
				/>

				<Metadata>
					<Title>Suas senhas</Title>
					<TotalPassCount>
						{searchListData.length
							? `${`${searchListData.length}`.padStart(2, '0')} ao total`
							: 'Nada a ser exibido'}
					</TotalPassCount>
				</Metadata>

				<LoginList
					keyExtractor={(item) => item.id}
					data={searchListData}
					renderItem={({ item: loginData }) => {
						return (
							<LoginDataItem
								service_name={loginData.service_name}
								email={loginData.email}
								password={loginData.password}
							/>
						);
					}}
				/>
			</Container>
		</>
	);
}
