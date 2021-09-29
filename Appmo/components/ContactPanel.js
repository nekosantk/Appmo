import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'

const ContactPanel = ({ key, id, displayName, avatarUrl, statusMessage }) => {
    return (
        <ListItem key={id}>
            <Avatar 
                rounded
                source={{
                    uri: 'https://wallpapercave.com/wp/wp6409639.jpg',
                }}
            />
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "800" }}>
                    {displayName}
                </ListItem.Title>
                <ListItem.Subtitle>
                    {avatarUrl}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default ContactPanel

const styles = StyleSheet.create({})
