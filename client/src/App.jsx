import React, { useState } from "react";
import axios from "axios";
import './App.css';

// Custom UI Components
const Card = ({ children }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow">{children}</div>
);

const Button = ({ children, onClick, disabled }) => (
  <button
    className={`px-4 py-2 bg-blue-500 text-white rounded ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const Select = ({ onChange, children }) => (
  <select
    className="w-full p-2 bg-gray-700 text-white border rounded"
    onChange={onChange}
  >
    {children}
  </select>
);

// Symptoms Dictionary
const symptoms_dict = {
  itching: 0,
  skin_rash: 1,
  nodal_skin_eruptions: 2,
  continuous_sneezing: 3,
  shivering: 4,
  chills: 5,
  joint_pain: 6,
  stomach_pain: 7,
  acidity: 8,
  ulcers_on_tongue: 9,
  muscle_wasting: 10,
  vomiting: 11,
  burning_micturition: 12,
  spotting_urination: 13,
  fatigue: 14,
  weight_gain: 15,
  anxiety: 16,
  cold_hands_and_feets: 17,
  mood_swings: 18,
  weight_loss: 19,
  restlessness: 20,
  lethargy: 21,
  patches_in_throat: 22,
  irregular_sugar_level: 23,
  cough: 24,
  high_fever: 25,
  sunken_eyes: 26,
  breathlessness: 27,
  sweating: 28,
  dehydration: 29,
  indigestion: 30,
  headache: 31,
  yellowish_skin: 32,
  dark_urine: 33,
  nausea: 34,
  loss_of_appetite: 35,
  pain_behind_the_eyes: 36,
  back_pain: 37,
  constipation: 38,
  abdominal_pain: 39,
  diarrhoea: 40,
  mild_fever: 41,
  yellow_urine: 42,
  yellowing_of_eyes: 43,
  acute_liver_failure: 44,
  fluid_overload: 45,
  swelling_of_stomach: 46,
  swelled_lymph_nodes: 47,
  malaise: 48,
  blurred_and_distorted_vision: 49,
  phlegm: 50,
  throat_irritation: 51,
  redness_of_eyes: 52,
  sinus_pressure: 53,
  runny_nose: 54,
  congestion: 55,
  chest_pain: 56,
  weakness_in_limbs: 57,
  fast_heart_rate: 58,
  pain_during_bowel_movements: 59,
  pain_in_anal_region: 60,
  bloody_stool: 61,
  irritation_in_anus: 62,
  neck_pain: 63,
  dizziness: 64,
  cramps: 65,
  bruising: 66,
  obesity: 67,
  swollen_legs: 68,
  swollen_blood_vessels: 69,
  puffy_face_and_eyes: 70,
  enlarged_thyroid: 71,
  brittle_nails: 72,
  swollen_extremeties: 73,
  excessive_hunger: 74,
  extra_marital_contacts: 75,
  drying_and_tingling_lips: 76,
  slurred_speech: 77,
  knee_pain: 78,
  hip_joint_pain: 79,
  muscle_weakness: 80,
  stiff_neck: 81,
  swelling_joints: 82,
  movement_stiffness: 83,
  spinning_movements: 84,
  loss_of_balance: 85,
  unsteadiness: 86,
  weakness_of_one_body_side: 87,
  loss_of_smell: 88,
  bladder_discomfort: 89,
  foul_smell_of_urine: 90,
  continuous_feel_of_urine: 91,
  passage_of_gases: 92,
  internal_itching: 93,
  "toxic_look_(typhos)": 94,
  depression: 95,
  irritability: 96,
  muscle_pain: 97,
  altered_sensorium: 98,
  red_spots_over_body: 99,
  belly_pain: 100,
  abnormal_menstruation: 101,
  "dischromic _patches": 102,
  watering_from_eyes: 103,
  increased_appetite: 104,
  polyuria: 105,
  family_history: 106,
  mucoid_sputum: 107,
  rusty_sputum: 108,
  lack_of_concentration: 109,
  visual_disturbances: 110,
  receiving_blood_transfusion: 111,
  receiving_unsterile_injections: 112,
  coma: 113,
  stomach_bleeding: 114,
  distention_of_abdomen: 115,
  history_of_alcohol_consumption: 116,
  "fluid_overload.1": 117,
  blood_in_sputum: 118,
  prominent_veins_on_calf: 119,
  palpitations: 120,
  painful_walking: 121,
  pus_filled_pimples: 122,
  blackheads: 123,
  scurring: 124,
  skin_peeling: 125,
  silver_like_dusting: 126,
  small_dents_in_nails: 127,
  inflammatory_nails: 128,
  blister: 129,
  red_sore_around_nose: 130,
  yellow_crust_ooze: 131,
};
const App = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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
      // Send the selected symptoms in correct format
      const response = await axios.post("http://127.0.0.1:8080/predict", {
        symptoms: selectedSymptoms, // Ensure this is an array
      });

      // Set the prediction result
      setPrediction(response.data);
    } catch (error) {
      console.error("Error fetching prediction", error);
      setPrediction({ error: "Failed to fetch prediction" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Card>
        <div>
          <h1 className="text-xl font-bold mb-4">Disease Prediction</h1>

          {/* Typing input with suggestions */}
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 text-white border rounded mb-2"
            placeholder="Type a symptom..."
          />

          {/* Show suggested symptoms */}
          {suggestions.length > 0 && (
            <ul className="bg-gray-800 text-white rounded p-2 mb-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:bg-gray-600 p-1 rounded"
                  onClick={() => addSymptom(suggestion)}
                >
                  {suggestion.replace(/_/g, " ")}
                </li>
              ))}
            </ul>
          )}

          {/* Dropdown for selecting symptoms */}
          <Select onChange={(e) => addSymptom(e.target.value)}>
            <option value="" disabled>
              Select a symptom
            </option>
            {Object.keys(symptoms_dict).map((symptom) => (
              <option key={symptom} value={symptom}>
                {symptom.replace(/_/g, " ")}
              </option>
            ))}
          </Select>

          {/* Display selected symptoms */}
          <div className="mt-4">
            {selectedSymptoms.map((symptom, index) => (
              <div
                key={index}
                className="bg-gray-700 p-2 rounded mb-2 flex justify-between"
              >
                {symptom.replace(/_/g, " ")}
                <button
                  className="text-red-500 ml-2"
                  onClick={() => removeSymptom(symptom)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Predict Button */}
          <Button
            onClick={handleSubmit}
            disabled={selectedSymptoms.length === 0}
          >
            Predict Disease
          </Button>

          {/* Prediction Result */}
          {prediction && (
            <div className="mt-4 p-3 bg-green-700 rounded">
              <h2 className="text-lg font-bold">Predicted Disease:</h2>
              <p>{prediction.predicted_disease}</p>

              <h3 className="mt-2 font-semibold">Description:</h3>
              <p>{prediction.description}</p>

              <h3 className="mt-2 font-semibold">Precautions:</h3>
              <ul>
                {prediction.precautions?.[0]?.map((precaution, index) => (
                  <li key={index}>- {precaution}</li>
                ))}
              </ul>

              <h3 className="mt-2 font-semibold">Medications:</h3>
              <p>{prediction.medications?.[0]}</p>

              <h3 className="mt-2 font-semibold">Diet Recommendations:</h3>
              <p>{prediction.diets?.[0]}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default App;
