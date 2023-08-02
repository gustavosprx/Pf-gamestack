import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Card from "../../../utils/Card/Card";
import { getAllSlsUser, setLoading } from "../../../../redux/salesSlice";
import { getAllSalesUser } from "../../../../redux/salesActions";

import PurchaseCard from "./PurchaseCard"; // Importa el nuevo componente
import PurchaseDetails from "./PurchaseDetails"; // Importa el nuevo componente

const Shoppings = () => {
  const dispatch = useDispatch();
  const loged = useSelector((state) => state.usersState.isLogged);
  const userSales = useSelector((state) => state.salesState.allSlsUsr);
  const isLoading = useSelector((state) => state.salesState.loading);

  useEffect(() => {
    dispatch(getAllSalesUser(loged.id));
  }, []);

  const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);
  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = useState({});

  const handleShowDetails = (purchase) => {
    // purchase es el objeto de la compra
    setShowPurchaseDetails(true);
    setSelectedPurchaseDetails(purchase);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Este ordena las compras por fecha
  let sortedUserSales = [];

  if (userSales) {
    sortedUserSales = userSales
      .filter((item) => item.date) // Filtra elementos con fecha válida
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Purchase</Text>

      {!userSales && (
        <Text style={styles.heading}>You don't have any purchase yet.</Text>
      )}

      {sortedUserSales && (
        <FlatList
          data={sortedUserSales}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleShowDetails(item)}>
              <PurchaseCard videoG={item} />
            </TouchableOpacity>
          )}
        />
      )}
      {/* Modal para detalles de la compra */}

      {selectedPurchaseDetails && (
        <PurchaseDetails
          visible={showPurchaseDetails}
          closeModal={() => setShowPurchaseDetails(false)}
          purchaseDetails={selectedPurchaseDetails}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F5F5F5",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Shoppings;
