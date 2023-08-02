import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";

const PurchaseDetails = ({ visible, closeModal, purchaseDetails }) => {
  if (visible && closeModal && purchaseDetails) {
    return (
      <Modal
        animationType="slide"
        visible={visible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Transaction Details</Text>
            <Text style={styles.modalText}>
              Order Number: {purchaseDetails.id}
            </Text>
            <Text style={styles.modalText}>Date: {purchaseDetails.date}</Text>
            <Text style={styles.modalText}>
              Sales Status: {purchaseDetails.salesStatus}
            </Text>
            <Text style={styles.modalText}>
              Quantity: {purchaseDetails.items[0].quantity}
            </Text>
            <Text style={styles.modalText}>
              VideoGameName: {purchaseDetails.items[0].videogameName}
            </Text>

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  } else if (!visible && !closeModal && !purchaseDetails) {
    return <Text style={styles.modalText}>VideoGameName: cdcdcd</Text>;
  }
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semi-transparente
  },
  modalContent: {
    backgroundColor: "#E1F5FE", // Color de fondo en tono azul claro
    borderRadius: 8,
    padding: 16,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000", // Agregamos sombra
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1976D2", // Color del texto en tono azul más oscuro
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#2196F3", // Color del texto en tono azul
  },
  closeButton: {
    backgroundColor: "#1976D2", // Color del botón en tono azul más oscuro
    padding: 8,
    borderRadius: 4,
    marginTop: 16,
  },
  closeButtonText: {
    color: "#FFF", // Color del texto en blanco
    textAlign: "center",
    fontSize: 16,
  },
});

export default PurchaseDetails;
