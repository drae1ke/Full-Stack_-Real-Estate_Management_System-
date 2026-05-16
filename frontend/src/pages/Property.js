import { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { HiOutlineBuildingOffice2, HiOutlineMapPin, HiOutlineSparkles } from "react-icons/hi2";
import { SearchContext } from "../context/SearchContext";
import { getProperty, searchProperty } from "../api/propertyApi";
import { imageUrl } from "../api/client";
import { formatKenyanCurrency } from "../utils/formatters";
import { getUnitMetrics, formatStatusLabel, statusTone } from "../utils/rentalTools";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 0 4rem;
`;

const Hero = styled.section`
  border-radius: 32px;
  padding: 2rem;
  background:
    radial-gradient(circle at top right, rgba(212, 184, 118, 0.2), transparent 34%),
    linear-gradient(135deg, #142239 0%, #203654 100%);
  color: white;
  box-shadow: 0 24px 60px rgba(12, 26, 47, 0.18);
`;

const HeroTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #f2d489;
  font-weight: 800;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

const Title = styled.h1`
  margin: 0.75rem 0 0;
  font-size: clamp(2rem, 4vw, 3.3rem);
`;

const Description = styled.p`
  margin: 0.9rem 0 0;
  color: rgba(237, 243, 251, 0.76);
  line-height: 1.75;
  max-width: 45rem;
`;

const SearchRow = styled.form`
  margin-top: 1.75rem;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1 1 18rem;
  min-height: 3.4rem;
  padding: 0 1rem;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.1);
  color: white;

  &::placeholder {
    color: rgba(232, 239, 247, 0.68);
  }
`;

const SearchButton = styled.button`
  min-height: 3.4rem;
  padding: 0 1.3rem;
  border-radius: 18px;
  border: none;
  background: linear-gradient(135deg, #d7b56d, #f0d28f);
  color: #142137;
  font-weight: 800;
  cursor: pointer;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const FilterChip = styled.button`
  padding: 0.65rem 0.95rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? "#f0d28f" : "rgba(255, 255, 255, 0.18)")};
  background: ${({ $active }) =>
    $active ? "rgba(240, 210, 143, 0.16)" : "rgba(255, 255, 255, 0.06)"};
  color: white;
  cursor: pointer;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ResultsTitle = styled.h2`
  margin: 0;
  color: #132239;
`;

const ResultsMeta = styled.div`
  color: #607184;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 28px;
  background: white;
  border: 1px solid rgba(19, 34, 57, 0.08);
  box-shadow: 0 22px 55px rgba(11, 26, 46, 0.08);
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 28px 70px rgba(11, 26, 46, 0.14);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 15rem;
  object-fit: cover;
`;

const CardBody = styled.div`
  padding: 1.3rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const CategoryBadge = styled.div`
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  background: rgba(20, 47, 87, 0.08);
  color: #15345e;
  font-size: 0.82rem;
  font-weight: 700;
`;

const Price = styled.div`
  color: #132239;
  font-size: 1.45rem;
  font-weight: 800;
`;

const Name = styled.h3`
  margin: 0;
  color: #142239;
  font-size: 1.2rem;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: #627487;
  font-size: 0.95rem;
`;

const DescriptionText = styled.p`
  margin: 0;
  color: #5d6f81;
  line-height: 1.65;
`;

const UnitSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
`;

const UnitStat = styled.div`
  border-radius: 18px;
  padding: 0.85rem;
  background: #f7fafc;
`;

const UnitStatLabel = styled.div`
  color: #607184;
  font-size: 0.83rem;
`;

const UnitStatValue = styled.div`
  margin-top: 0.35rem;
  color: #132239;
  font-size: 1.05rem;
  font-weight: 800;
`;

const EmptyState = styled.div`
  border-radius: 28px;
  padding: 2rem;
  background: white;
  border: 1px solid rgba(19, 34, 57, 0.08);
  color: #5d6f81;
  line-height: 1.7;
`;

function Products() {
  const [properties, setProperties] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const {
    searchResults,
    search,
    categoryFilter,
    inStockFilter,
    applySearch,
    applySearchResults,
  } = useContext(SearchContext);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await getProperty();
        setProperties(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const activeProperties = useMemo(() => {
    if (searchResults.length > 0) {
      return searchResults;
    }

    if (search || categoryFilter || inStockFilter) {
      return [];
    }

    return properties;
  }, [categoryFilter, inStockFilter, properties, search, searchResults]);

  const filteredProperties = useMemo(() => {
    return activeProperties.filter((property) => {
      if (availabilityFilter === "all") {
        return true;
      }

      const metrics = getUnitMetrics(property);

      if (availabilityFilter === "vacant") {
        return metrics.vacant > 0;
      }

      if (availabilityFilter === "occupied") {
        return metrics.occupied > 0;
      }

      if (availabilityFilter === "maintenance") {
        return metrics.maintenance > 0;
      }

      return true;
    });
  }, [activeProperties, availabilityFilter]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const response = await searchProperty({ searchText: searchValue });
    applySearchResults(Array.isArray(response) ? response : []);
    applySearch(searchValue);
  };

  return (
    <Page>
      <Hero>
        <HeroTop>
          <div>
            <Eyebrow>
              <HiOutlineSparkles />
              Corporate Booking Experience
            </Eyebrow>
            <Title>Explore high-quality rental availability</Title>
            <Description>
              Browse apartment blocks, homes, and commercial listings with clear
              room status indicators, cleaner unit summaries, and a booking
              experience designed to feel deliberate and professional.
            </Description>
          </div>
        </HeroTop>

        <SearchRow onSubmit={handleSearch}>
          <SearchInput
            type="search"
            value={searchValue}
            placeholder="Search by estate, town, county, or address..."
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <SearchButton type="submit">Search Availability</SearchButton>
        </SearchRow>

        <FilterRow>
          {["all", "vacant", "occupied", "maintenance"].map((filter) => (
            <FilterChip
              key={filter}
              type="button"
              $active={availabilityFilter === filter}
              onClick={() => setAvailabilityFilter(filter)}
            >
              {filter === "all"
                ? "All listings"
                : `${formatStatusLabel(filter)} units`}
            </FilterChip>
          ))}
        </FilterRow>
      </Hero>

      <ResultsHeader>
        <ResultsTitle>Available Portfolio</ResultsTitle>
        <ResultsMeta>
          {loading
            ? "Loading listings..."
            : `${filteredProperties.length} professional listing${
                filteredProperties.length === 1 ? "" : "s"
              } available`}
        </ResultsMeta>
      </ResultsHeader>

      {loading ? (
        <EmptyState>Loading property inventory...</EmptyState>
      ) : filteredProperties.length === 0 ? (
        <EmptyState>
          No listings match the current search or room status filters. Try a
          broader location search or switch back to all availability.
        </EmptyState>
      ) : (
        <Grid>
          {filteredProperties.map((property) => {
            const metrics = getUnitMetrics(property);
            const availableUnitLabel =
              property.category === "Apartment"
                ? `${metrics.vacant} unit${metrics.vacant === 1 ? "" : "s"} available`
                : property.status || "active";

            return (
              <Card key={property._id} to={`/property/${property._id}`}>
                <CardImage src={imageUrl(property.image)} alt={property.name} />
                <CardBody>
                  <LabelRow>
                    <CategoryBadge>{property.category}</CategoryBadge>
                    <Price>{formatKenyanCurrency(property.price)}</Price>
                  </LabelRow>
                  <Name>{property.name}</Name>
                  <Meta>
                    <HiOutlineMapPin />
                    {property.address}
                  </Meta>
                  <Meta>
                    <HiOutlineBuildingOffice2 />
                    {availableUnitLabel}
                  </Meta>
                  <DescriptionText>
                    {property.description?.slice(0, 140)}
                    {property.description?.length > 140 ? "..." : ""}
                  </DescriptionText>
                  {property.category === "Apartment" && metrics.total > 0 && (
                    <UnitSummary>
                      {[
                        { key: "vacant", value: metrics.vacant },
                        { key: "reserved", value: metrics.reserved },
                        { key: "occupied", value: metrics.occupied },
                      ].map((item) => {
                        const tone = statusTone(item.key);
                        return (
                          <UnitStat
                            key={item.key}
                            style={{
                              background: tone.background,
                              color: tone.color,
                            }}
                          >
                            <UnitStatLabel>{formatStatusLabel(item.key)}</UnitStatLabel>
                            <UnitStatValue>{item.value}</UnitStatValue>
                          </UnitStat>
                        );
                      })}
                    </UnitSummary>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </Grid>
      )}
    </Page>
  );
}

export default Products;
