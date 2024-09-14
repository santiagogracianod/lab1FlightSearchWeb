"use client";

import { useState } from "react";
import axios from "axios";

import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from 'primereact/toast';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

interface Flight {
  origin: string;
  destination: string;
  date: string;
  econ_price: number;
  busi_price: number;
  scale: boolean|string,
  airline: string,
  econ_avaib_seats: number,
  busi_avaib_seats: number
}

export default function Home() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filters, setFilters] = useState({
    origin: false,
    destination: false,
    scale: false,
    airline: false
  });
  const [filterValues, setFilterValues] = useState({
    origin: "",
    destination: "",
    scale: false,
    airline: ""
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.checked });
    if (e.target.name == "scale"){
      setFilterValues({ ...filterValues, [e.target.name]: e.checked });
    }
  };

  const handleInputChange = (e: any) => {
    setFilterValues({ ...filterValues, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Flight[]>('http://localhost:8080/api/flights/search', {
        params: {
          startDate: startDate?.toISOString().split('T')[0],
          endDate: endDate?.toISOString().split('T')[0],
          origin: filters.origin ? filterValues.origin : undefined,
          destination: filters.destination ? filterValues.destination : undefined,
          scale: filters.scale ? filterValues.scale : false,
          airline: filters.airline ? filterValues.airline : undefined
        }
      });
      response.data.forEach((e)=>{
        if(e.scale){
          e.scale="Yes";
        } else {
          e.scale="No";
        }
      })
      setFlights(response.data);
    } catch (error) {
      console.error('Error al buscar vuelos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5 w-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-3/4">
        <h2 className="text-2xl font-semibold text-center mb-6">Flight search</h2>

        {/* Fechas */}
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date:
          </label>
          <Calendar
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.value as Date)}
            placeholder="Select start date"
            dateFormat="yy-mm-dd"
            className="w-full p-inputtext p-component"
            showIcon
          />
        </div>

        <div className="mb-4">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            End Date:
          </label>
          <Calendar
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.value as Date)}
            placeholder="Select end date"
            dateFormat="yy-mm-dd"
            className="w-full p-inputtext p-component"
            showIcon
          />
        </div>

        {/* Filtros */}
        <div className="space-y-4">
          <div>
            <Checkbox
              inputId="filterOrigin"
              name="origin"
              checked={filters.origin}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="filterOrigin" className="ml-2 text-sm font-medium">
              Filter by Origin
            </label>
            {filters.origin && (
              <input
                name="origin"
                value={filterValues.origin}
                onChange={handleInputChange}
                placeholder="Enter origin"
                className="w-full mt-2 p-inputtext p-component"
              />
            )}
          </div>

          <div>
            <Checkbox
              inputId="filterDestination"
              name="destination"
              checked={filters.destination}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="filterDestination" className="ml-2 text-sm font-medium">
              Filter by Destination
            </label>
            {filters.destination && (
              <input
                name="destination"
                value={filterValues.destination}
                onChange={handleInputChange}
                placeholder="Enter destination"
                className="w-full mt-2 p-inputtext p-component"
              />
            )}
          </div>

          <div>
            <Checkbox
              inputId="filterScale"
              name="scale"
              checked={filters.scale}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="filterScale" className="ml-2 text-sm font-medium">
              Show flights with scale
            </label>
          </div>


          <div>
            <Checkbox
              inputId="filterAirline"
              name="airline"
              checked={filters.airline}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="filterAirline" className="ml-2 text-sm font-medium">
              Filter by Airline
            </label>
            {filters.airline && (
              <input
                name="airline"
                value={filterValues.airline}
                onChange={handleInputChange}
                placeholder="Enter airline"
                className="w-full mt-2 p-inputtext p-component"
              />
            )}
          </div>
        </div>
        {/* Botón de búsqueda */}
        <Button label="Search" icon="pi pi-search" onClick={handleSearch} className="w-full mt-6 p-button" disabled={loading} />

        {/* Tabla de resultados */}
        {loading && <p className="text-center mt-4">Cargando vuelos...</p>}

        {flights.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Results</h3>
            <DataTable value={flights} className="w-full" size="small">
              <Column field="origin" header="Origin" />
              <Column field="destination" header="Destination" />
              <Column field="date" header="Date" />
              <Column field="econ_price" header="Economic Price" />
              <Column field="busi_price" header="Business Price" />
              <Column field="scale" header="Scale" />
              <Column field="airline" header="Airline" />
              <Column field="econ_avaib_seats" header="Economic Seats" />
              <Column field="busi_avaib_seats" header="Business Seats" />
            </DataTable>
          </div>
        )}
      </div>
    </div>
  );
}