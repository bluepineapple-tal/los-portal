"use client";

import { useEffect, useState } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

import { LoanOfferList } from "@/components/loan-offers/loan-offer-list";
import {
  IProductMake,
  IProductModel,
} from "@/components/products/product.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_BASE_URL } from "@/lib/constants";

export const LoanOffersPageTemplate = () => {
  const session = useSessionContext();

  // State for all possible Makes (fetched from backend)
  const [makes, setMakes] = useState<IProductMake[]>([]);
  // State for all possible Models for the selected Make
  const [models, setModels] = useState<IProductModel[]>([]);

  // The user's selected Make ID and Model ID
  const [selectedMakeId, setSelectedMakeId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");

  // Loading/error states for each fetch call
  const [loadingMakes, setLoadingMakes] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [errorMakes, setErrorMakes] = useState<string | null>(null);
  const [errorModels, setErrorModels] = useState<string | null>(null);

  // 1) Fetch all Makes on component mount
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setLoadingMakes(true);
        const response = await fetch(`${API_BASE_URL}/product-make`);
        if (!response.ok) {
          throw new Error(`Failed to fetch makes: ${response.statusText}`);
        }
        const data = (await response.json()) as IProductMake[];
        setMakes(data);
      } catch (error) {
        setErrorMakes(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoadingMakes(false);
      }
    };

    fetchMakes();
  }, []);

  // 2) When the user selects a Make, fetch the Models for that Make
  const handleMakeChange = async (newMakeId: string) => {
    setSelectedMakeId(newMakeId);
    setSelectedModelId(""); // reset model selection
    setModels([]); // clear old models
    setErrorModels(null);

    if (!newMakeId) return; // if user deselects, do nothing

    try {
      setLoadingModels(true);
      const response = await fetch(
        `${API_BASE_URL}/product-model/make/${newMakeId}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }
      const data = (await response.json()) as IProductModel[];
      setModels(data);
    } catch (error) {
      setErrorModels(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoadingModels(false);
    }
  };

  const handleModelChange = (newModelId: string) => {
    setSelectedModelId(newModelId);
  };

  // Check session
  if (session.loading) {
    return <div>Loading Session...</div>;
  }
  if (session.doesSessionExist === false) {
    return <div>Session does not exist</div>;
  }

  // TODO: Remove this comment
  // eslint-disable-next-line no-console
  console.log(`Client side component got userId: ${session.userId}`);
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Loan Offers</h1>

      {/* Make & Model Dropdowns */}
      <div className="flex items-end space-x-4 mb-4">
        {/* MAKE SELECT */}
        <div>
          <label htmlFor="makeSelect" className="block mb-1 font-medium">
            Select Make
          </label>
          {loadingMakes && <p>Loading makes...</p>}
          {errorMakes ? (
            <p className="text-red-500">Error: {errorMakes}</p>
          ) : (
            <Select onValueChange={(value) => handleMakeChange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Choose a Make" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((make) => (
                  <SelectItem key={make.id} value={make.id}>
                    {make.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* MODEL SELECT */}
        <div>
          <label htmlFor="modelSelect" className="block mb-1 font-medium">
            Select Model
          </label>
          {loadingModels && <p>Loading models...</p>}
          {errorModels ? (
            <p className="text-red-500">Error: {errorModels}</p>
          ) : (
            <Select
              onValueChange={(value) => handleModelChange(value)}
              disabled={!selectedMakeId || models.length === 0}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={
                    selectedMakeId && models.length === 0
                      ? "No Model found"
                      : "Choose a Model"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {models.map((models) => (
                  <SelectItem key={models.id} value={models.id}>
                    {models.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Loan Offers List */}
      {selectedMakeId && selectedModelId ? (
        <LoanOfferList makeId={selectedMakeId} modelId={selectedModelId} />
      ) : (
        <p>Please select both a make and a model.</p>
      )}
    </div>
  );
};
