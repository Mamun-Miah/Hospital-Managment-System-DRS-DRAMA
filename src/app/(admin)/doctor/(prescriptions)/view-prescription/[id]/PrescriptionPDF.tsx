/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    marginBottom: 8,
  },
  doctorInfo: {
    lineHeight: 1.2,
  },
  doctorName: {
    fontSize: "17px",
    fontWeight: "semibold",
    marginBottom: "4px",
  },

  hospitalInfo: {
    textAlign: "right",
    lineHeight: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginVertical: 10,
  },
  patientInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    lineHeight: 1,
  },
  // Treatment style
  container: {
    // width: "50%",
    marginTop: 10,
    fontSize: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  header1: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottom: "1px solid #ccc",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottom: "1px solid #eee",
  },
  tablCol1: {
    width: "60%",
  },
  tablCol2: {
    width: "40%",
    textAlign: "left",
    marginLeft: 284,
  },
  text: {
    fontSize: 10,
    color: "#1e293b",
  },
  table: {
    width: "100%",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  tableHeader: {
    fontWeight: "semibold",
  },
  col1: { width: "40%" },
  col2: { width: "42%" },
  col3: { width: "18%" },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signature: {
    marginTop: 30,
    fontSize: 10,
  },
  hr: {
    borderBottomWidth: "1px",
    borderBottomColor: "#eee",
    width: "100%",
    marginVertical: 8,
  },
});

const PrescriptionPDF = ({ data }: { data: any }) => {
  const {
    prescribed_at,
    next_visit_date,
    advise,
    patient,
    doctor,
    is_drs_derma,
    items,
    treatmentItems,
  } = data;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{is_drs_derma === "Yes" ? "DRS DERMA" : doctor?.doctor_name}</Text>
             <Text>{is_drs_derma === "Yes" ? "" : doctor?.designation}</Text>
           
          </View>
          <View style={styles.hospitalInfo}>
            <Image style={styles.logo} src="/images/logo.png" />
            <Text>S. Arrowhead Court, Branford9</Text>
            <Text>+1 444 266 5599</Text>
          </View>
        </View>

        <View style={styles.hr} />
        {/* Patient Info */}
        <Text style={styles.sectionTitle}>Patient</Text>
        <View style={styles.patientInfo}>
          <View>
            <Text>ID: {data?.patient_id}</Text>
            <Text>Name: {patient?.patient_name}</Text>
            <Text>Address: {patient?.city}</Text>
            <Text>Mobile Number: {patient?.mobile_number}</Text>
          </View>
          <View>
            <Text>Gender: {patient?.gender}</Text>
            <Text>Age: {patient?.age}</Text>
            <Text>Blood Group: {patient?.blood_group}</Text>
            <Text>
              Weight: {patient?.weight} <keygen />
            </Text>
          </View>
          <View>
            <Text>Date: {prescribed_at}</Text>
            <Text>Next Date: {next_visit_date}</Text>
          </View>
        </View>

        {/* Treatments */}
        <View style={styles.container}>
          <Text style={styles.title}>Treatments:</Text>

          {/* Header Row */}
          <View style={styles.header1}>
            <Text style={[styles.tablCol1, styles.text]}>Treatment Name</Text>
            <Text style={[styles.tablCol2, styles.text]}>Duration</Text>
          </View>

          {/* Treatments Rows */}
          {treatmentItems?.map((treatment:any) => (
            <View key={treatment.id} style={styles.row}>
              <Text style={[styles.tablCol1, styles.text]}>
                {treatment?.treatment_name}
              </Text>
              <Text style={[styles.tablCol2, styles.text]}>
                {treatment?.duration_months}
              </Text>
            </View>
          ))}
        </View>

        {/* Medicines*/}
        <View style={styles.table}>
          <Text style={[styles.title, { marginTop: "10px" }]}>Medicines:</Text>
          <View style={styles.hr} />
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.col1}>Medicine Name</Text>
            <Text style={styles.col2}>Dosage</Text>
            <Text style={styles.col3}>Duration</Text>
          </View>
          <View style={styles.hr} />

          {items.map((med:any, index: number) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.col1}>
                {index + 1}. {med.medicine_name}
              </Text>
              <Text style={styles.col2}>
                {med?.dose_morning} Morning - {med?.dose_mid_day} Midday -{" "}
                {med?.dose_night} Night
              </Text>
              <Text style={styles.col3}>{med.duration_days}</Text>
            </View>
          ))}
        </View>

        <View style={styles.hr} />

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Advice Given:</Text>
            {"\n"}• {advise}
          </Text>
          {/* <View style=} /> */}
          <View style={styles.signature}>
            <Image
              style={{ width: 50, marginHorizontal: "auto" }}
              src="/images/signature.png"
            />
            <Text
              style={{
                width: "100%",
                borderBottom: "1px",
                borderColor: "#eee",
              }}
            />
            <Text>{doctor.doctor_name}</Text>
            <Text style={{ marginTop: 5 }}>MBBS, MD, MS (Reg No: 321456)</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PrescriptionPDF;
