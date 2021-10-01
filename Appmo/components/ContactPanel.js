import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'

const ContactPanel = ({ id, displayName, avatarUrl, statusMessage }) => {
    return (
        <ListItem key={id}>
            <Avatar 
                rounded
                source={{
                    uri: avatarUrl,
                }}
            />
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "800" }}>
                    {displayName}
                </ListItem.Title>
                <ListItem.Subtitle>
                    {statusMessage?.[0]?.email}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default ContactPanel

const styles = StyleSheet.create({})
