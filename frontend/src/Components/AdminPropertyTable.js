import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { deleteProperty, getProperty } from "../api/propertyApi";
import { imageUrl } from "../api/client";
import { formatKenyanCurrency } from "../utils/formatters";

const SectionCard = styled.section`
  background: #ffffff;
  border: 1px solid #d7e0d9;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 14px 40px rgba(24, 53, 40, 0.08);
`;

const SectionTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: #173f2d;
`;

const SectionText = styled.p`
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #50616f;
  line-height: 1.6;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #eff6f0;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e6ece8;
`;

const TableHeader = styled.th`
  padding: 0.95rem;
  text-align: left;
  color: #173f2d;
  font-size: 0.95rem;
`;

const TableCell = styled.td`
  padding: 0.95rem;
  vertical-align: top;
  color: #263844;
`;

const ListingImage = styled.img`
  width: 5rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 12px;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  font-weight: 600;
  color: white;
  background-color: ${({ $variant }) =>
    $variant === "danger" ? "#c0392b" : "#1f7a4d"};
`;

const EmptyState = styled.div`
  padding: 1rem 0;
  color: #6a7b88;
`;

function AdminPropertyTable({ refreshKey }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperty();
        setProperties(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [refreshKey]);

  const handleDelete = async (propertyId, propertyName) => {
    const confirmed = window.confirm(
      `Delete "${propertyName}" from the listings?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProperty(propertyId);
      setProperties((currentProperties) =>
        currentProperties.filter((property) => property._id !== propertyId)
      );
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("The property could not be deleted.");
    }
  };

  return (
    <SectionCard>
      <SectionTitle>Manage existing listings</SectionTitle>
      <SectionText>
        Edit or remove properties from the live catalogue without leaving the
        admin workspace.
      </SectionText>
      {loading ? (
        <EmptyState>Loading properties...</EmptyState>
      ) : properties.length === 0 ? (
        <EmptyState>No properties have been added yet.</EmptyState>
      ) : (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Image</TableHeader>
                <TableHeader>Listing</TableHeader>
                <TableHeader>Category</TableHeader>
                <TableHeader>Location</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {properties.map((property) => (
                <TableRow key={property._id}>
                  <TableCell>
                    <ListingImage
                      src={imageUrl(property.image)}
                      alt={property.name}
                    />
                  </TableCell>
                  <TableCell>{property.name}</TableCell>
                  <TableCell>{property.category}</TableCell>
                  <TableCell>{property.address}</TableCell>
                  <TableCell>{formatKenyanCurrency(property.price)}</TableCell>
                  <TableCell>
                    <ActionRow>
                      <ActionButton
                        type="button"
                        onClick={() => navigate(`/edit/${property._id}`)}
                      >
                        Edit
                      </ActionButton>
                      <ActionButton
                        type="button"
                        $variant="danger"
                        onClick={() =>
                          handleDelete(property._id, property.name)
                        }
                      >
                        Delete
                      </ActionButton>
                    </ActionRow>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </SectionCard>
  );
}

export default AdminPropertyTable;
