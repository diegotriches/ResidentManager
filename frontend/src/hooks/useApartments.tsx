import { useCallback, useEffect, useState } from "react";
import {
  createApartments,
  deleteApartments,
  getApartments,
  updateApartments,
} from "../services/apartmentsService";
import type { ApartmentsData, Apartment } from "../types/apartments";

export const useApartments = () => {
  const initialForm = {
    number: 0,
    ownerName: "",
  };

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [formData, setFormData] = useState<ApartmentsData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [editingApartmentId, setEditingApartmentId] = useState<number | null>(
    null,
  );

  const fetchApartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getApartments();
      setApartments(response);
    } catch (error) {
      console.error("Erro ao carregar apartamentos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  const handleSubmit = async () => {
    try {
      if (!editingApartmentId) {
        await createApartments(formData);
      } else {
        await updateApartments(editingApartmentId, formData);
      }

      setFormData(initialForm);
      setEditingApartmentId(null);
      await fetchApartments();

      return true;
    } catch (error) {
      console.error("Erro na operação:", error);
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const finalValue = name === "number" ? Number(value) : value;

    setFormData((prev) => {
      const newData = { ...prev, [name]: finalValue };
      return newData;
    });
  };

  const handleEdit = (apartment: Apartment) => {
    setEditingApartmentId(apartment.id);
    setFormData({
      number: apartment.number,
      ownerName: apartment.ownerName,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteApartments(id);
      fetchApartments();
    } catch (error) {
      console.error("Erro ao deletar apartamento:", error);
    }
  };

  return {
    initialForm,
    apartments,
    loading,
    formData,
    setFormData,
    handleSubmit,
    handleChange,
    handleEdit,
    handleDelete,
  };
};
