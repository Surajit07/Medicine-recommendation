import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import data from "./jsonData/symtoms_dict.json";
import {
  Search,
  Plus,
  X,
  AlertCircle,
  Clipboard,
  Heart,
  Shield,
  Coffee,
  Pill,
  Languages,               //this is new part
} from "lucide-react";

// Custom UI Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-gray-800 p-6 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled, className = "" }) => (
  <button
    className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    } ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const Select = ({ onChange, children }) => (
  <div className="relative">
    <select
      className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
      onChange={onChange}
    >
      {children}
    </select>
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <Plus size={16} />
    </div>
  </div>
);

// Symptoms Dictionary
const symptoms_dict = data.symptoms_dict;

const App = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");             //this is new part

  // Function to handle typing input and show suggestions
  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    setInputText(value);

    if (value.length > 0) {
      const filtered = Object.keys(symptoms_dict).filter((symptom) =>
        symptom.replace(/_/g, " ").toLowerCase().includes(value)
      );
      setSuggestions(filtered.slice(0, 5)); // Show top 5 matches
    } else {
      setSuggestions([]);
    }
  };

  // Function to add selected symptom
  const addSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom) || selectedSymptoms.length >= 10)
      return;
    setSelectedSymptoms([...selectedSymptoms, symptom]);
    setInputText(""); // Clear input after adding
    setSuggestions([]);
  };

  // Function to remove a selected symptom
  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
  };

  // Function to handle API call for prediction
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // Send the selected symptoms in correct format
      const response = await axios.post("http://127.0.0.1:8080/predict", {
        symptoms: selectedSymptoms, // Ensure this is an array
        lang: language,                     //this is new part
      });

      // Set the prediction result
      setPrediction(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching prediction", error);
      setPrediction({ error: "Failed to fetch prediction" });
      setIsLoading(false);
    }

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <Heart className="text-red-500 mr-3" size={32} />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Medicine Recommendation System
          </h1>
        </div>


                                          {/* this is new part */}

        {/* Add Language Selector */}
        <div className="mb-6 flex justify-end">
          <div className="relative w-40">
            <div className="flex items-center bg-gray-700 rounded-lg border border-gray-600">
              <Languages className="ml-3 text-gray-400" size={18} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white border-none rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>
        </div>
                                          {/* // this is new part */}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Input Section */}
          <Card className="h-full">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <AlertCircle className="mr-2" size={20} />
              Select Your Symptoms
            </h2>

            {/* Typing input with suggestions */}
            <div className="relative mb-4">
              <div className="flex items-center bg-gray-700 rounded-lg border border-gray-600 focus-within:ring-2 focus-within:ring-blue-500">
                <Search className="ml-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-transparent text-white focus:outline-none"
                  placeholder="Type a symptom..."
                />
              </div>

              {/* Show suggested symptoms */}
              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-gray-700 text-white rounded-lg mt-1 shadow-xl border border-gray-600 max-h-60 flex flex-col justify-end items-center overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex-row justify-start cursor-pointer hover:bg-gray-600 p-3 border-b border-gray-600 last:border-b-0 flex items-center w-full"
                      onClick={() => addSymptom(suggestion)}
                    >
                      <Plus className="mr-2 text-blue-400" size={16} />
                      {suggestion.replace(/_/g, " ")}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Dropdown for selecting symptoms */}
            <div className="mb-6">
              <Select
                onChange={(e) => e.target.value && addSymptom(e.target.value)}
              >
                <option value="">Select a symptom</option>
                {Object.keys(symptoms_dict).map((symptom) => (
                  <option key={symptom} value={symptom}>
                    {symptom.replace(/_/g, " ")}
                  </option>
                ))}
              </Select>
            </div>

            {/* Display selected symptoms */}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2 text-gray-300">
                Selected Symptoms ({selectedSymptoms.length}/10)
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.length === 0 ? (
                  <p className="text-gray-400 italic">No symptoms selected</p>
                ) : (
                  selectedSymptoms.map((symptom, index) => (
                    <div
                      key={index}
                      className="bg-blue-900/50 border border-blue-700 py-1 px-3 rounded-full flex items-center text-sm"
                    >
                      {symptom.replace(/_/g, " ")}
                      <div
                        onClick={() => removeSymptom(symptom)}
                        className=" hover:text-red-300 focus:outline-none ml-2 p-1 bg-blue-800 rounded-full flex justify-center items-center"
                      >
                        <X size={14} />
                        {/* <button
                          className=" text-red-400  hover:text-red-300 rounded-full focus:outline-none"
                          onClick={() => removeSymptom(symptom)}
                          aria-label="Remove symptom"
                        >
                          <X size={14} />
                        </button> */}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Predict Button */}
            <Button
              onClick={handleSubmit}
              disabled={selectedSymptoms.length === 0 || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Clipboard size={18} />
                  <span>Predict Disease</span>
                </>
              )}
            </Button>
          </Card>

          {/* Results Section */}
          <Card
            className={`${
              prediction ? "bg-gray-800" : "bg-gray-800/50"
            } h-full transition-all`}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Clipboard className="mr-2" size={20} />
              Results
            </h2>

            {!prediction ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <AlertCircle size={48} className="mb-4 opacity-30" />
                <p className="text-center">
                  Submit your symptoms to see disease prediction and
                  recommendations
                </p>
              </div>
            ) : prediction.error ? (
              <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-center">{prediction.error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                  <h3 className="text-lg font-bold flex items-center text-green-400">
                    <Heart className="mr-2" size={18} />
                    Predicted Disease
                  </h3>
                  <p className="text-xl mt-1">{prediction.predicted_disease}</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold flex items-center mb-2 text-blue-300">
                    <Clipboard className="mr-2" size={16} />
                    Description
                  </h3>
                  <p className="text-sm text-gray-300">
                    {prediction.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-semibold flex items-center mb-2 text-blue-300">
                    <Shield className="mr-2" size={16} />
                    Precautions
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    {/* {prediction.precautions?.[0]?.map((precaution, index) => ( */}
                    {prediction.precautions?.map((precaution, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-green-400">•</span>
                        {precaution}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold flex items-center mb-2 text-blue-300">
                    {/* <Pills className="mr-2" size={16} /> */}
                    <Pill className="mr-2" size={16} />
                    Medications
                  </h3>
                  {/* <p className="text-sm text-gray-300">
                    {prediction.medications?.[0]}
                  </p> */}
                  <ul className="space-y-1 text-sm text-gray-300">
                    {prediction.medications?.map((medication, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-green-400">•</span>
                        {medication}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold flex items-center mb-2 text-blue-300">
                    <Coffee className="mr-2" size={16} />
                    Diet Recommendations
                  </h3>
                  {/* <p className="text-sm text-gray-300">
                    {prediction.diets?.[0]}
                  </p> */}
                  <ul className="space-y-1 text-sm text-gray-300">
                    {prediction.diets?.map((diet, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-green-400">•</span>
                        {diet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default App;


//-------------------------------------------

// import React, { useState } from "react";
// import axios from "axios";
// import './App.css';
// import data from './jsonData/symtoms_dict.json'

// // Custom UI Components
// const Card = ({ children }) => (
//   <div className="bg-gray-800 p-4 rounded-lg shadow">{children}</div>
// );

// const Button = ({ children, onClick, disabled }) => (
//   <button
//     className={`px-4 py-2 bg-blue-500 text-white rounded ${
//       disabled ? "opacity-50 cursor-not-allowed" : ""
//     }`}
//     onClick={onClick}
//     disabled={disabled}
//   >
//     {children}
//   </button>
// );

// const Select = ({ onChange, children }) => (
//   <select
//     className="w-full p-2 bg-gray-700 text-white border rounded"
//     onChange={onChange}
//   >
//     {children}
//   </select>
// );

// // Symptoms Dictionary
// const symptoms_dict = data.symptoms_dict

// const App = () => {
//   const [selectedSymptoms, setSelectedSymptoms] = useState([]);
//   const [prediction, setPrediction] = useState(null);
//   const [inputText, setInputText] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   // Function to handle typing input and show suggestions
//   const handleInputChange = (event) => {
//     const value = event.target.value.toLowerCase();
//     setInputText(value);

//     if (value.length > 0) {
//       const filtered = Object.keys(symptoms_dict).filter((symptom) =>
//         symptom.replace(/_/g, " ").toLowerCase().includes(value)
//       );
//       setSuggestions(filtered.slice(0, 5)); // Show top 5 matches
//     } else {
//       setSuggestions([]);
//     }
//   };

//   // Function to add selected symptom
//   const addSymptom = (symptom) => {
//     if (selectedSymptoms.includes(symptom) || selectedSymptoms.length >= 10)
//       return;
//     setSelectedSymptoms([...selectedSymptoms, symptom]);
//     setInputText(""); // Clear input after adding
//     setSuggestions([]);
//   };

//   // Function to remove a selected symptom
//   const removeSymptom = (symptom) => {
//     setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
//   };

//   // Function to handle API call for prediction
//   const handleSubmit = async () => {
//     try {
//       // Send the selected symptoms in correct format
//       const response = await axios.post("http://127.0.0.1:8080/predict", {
//         symptoms: selectedSymptoms, // Ensure this is an array
//       });

//       // Set the prediction result
//       setPrediction(response.data);
//     } catch (error) {
//       console.error("Error fetching prediction", error);
//       setPrediction({ error: "Failed to fetch prediction" });
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//       <div className="flex justify-center mt-4" >
//         <h1 className="font-bold" >Medicine Recommendation System</h1>
//       </div>
//       <Card>
//         <div>
//           <h1 className="text-xl font-bold mb-4">Disease Prediction</h1>

//           {/* Typing input with suggestions */}
//           <input
//             type="text"
//             value={inputText}
//             onChange={handleInputChange}
//             className="w-full p-2 bg-gray-700 text-white border rounded mb-2"
//             placeholder="Type a symptom..."
//           />

//           {/* Show suggested symptoms */}
//           {suggestions.length > 0 && (
//             <ul className="bg-gray-800 text-white rounded p-2 mb-2">
//               {suggestions.map((suggestion, index) => (
//                 <li
//                   key={index}
//                   className="cursor-pointer hover:bg-gray-600 p-1 rounded"
//                   onClick={() => addSymptom(suggestion)}
//                 >
//                   {suggestion.replace(/_/g, " ")}
//                 </li>
//               ))}
//             </ul>
//           )}

//           {/* Dropdown for selecting symptoms */}
//           <Select onChange={(e) => addSymptom(e.target.value)}>
//             <option value="" disabled>
//               Select a symptom
//             </option>
//             {Object.keys(symptoms_dict).map((symptom) => (
//               <option key={symptom} value={symptom}>
//                 {symptom.replace(/_/g, " ")}
//               </option>
//             ))}
//           </Select>

//           {/* Display selected symptoms */}
//           <div className="mt-4">
//             {selectedSymptoms.map((symptom, index) => (
//               <div
//                 key={index}
//                 className="bg-gray-700 p-2 rounded mb-2 flex justify-between"
//               >
//                 {symptom.replace(/_/g, " ")}
//                 <button
//                   className="text-red-500 ml-2"
//                   onClick={() => removeSymptom(symptom)}
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Predict Button */}
//           <Button
//             onClick={handleSubmit}
//             disabled={selectedSymptoms.length === 0}
//           >
//             Predict Disease
//           </Button>

//           {/* Prediction Result */}
//           {prediction && (
//             <div className="mt-4 p-3 bg-green-700 rounded">
//               <h2 className="text-lg font-bold">Predicted Disease:</h2>
//               <p>{prediction.predicted_disease}</p>

//               <h3 className="mt-2 font-semibold">Description:</h3>
//               <p>{prediction.description}</p>

//               <h3 className="mt-2 font-semibold">Precautions:</h3>
//               <ul>
//                 {prediction.precautions?.[0]?.map((precaution, index) => (
//                   <li key={index}>- {precaution}</li>
//                 ))}
//               </ul>

//               <h3 className="mt-2 font-semibold">Medications:</h3>
//               <p>{prediction.medications?.[0]}</p>

//               <h3 className="mt-2 font-semibold">Diet Recommendations:</h3>
//               <p>{prediction.diets?.[0]}</p>
//             </div>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default App;
