function calculate() {

    // variable definition

    var iHerdImmunityReached;           // point in time when herd immunity is reached
    var herdImmunityReached;            // flag indicating whether herd immunity is reached
    var counter;                        // counter for lockdown
    var startLevelReached;
    var startLevelAlwaysReached;
    var iStartLevelReached;
    var redPopOnly;

    var titles = [];
    var graphAnnotations = [];
    var seriesLabels = [];

    var simData = [];

    for (i = 0; i < 730 + 1; i++) {
        simData[i] = [];
    }

    for (i = 0; i < 4; i++) {
        titles[i] = [];
    }
    for (i = 0; i < 6; i++) {
        graphAnnotations[i] = [];
    }
    for (i = 0; i < 10; i++) {
        seriesLabels[i] = [];
    }


    // initialize simulation data
    simData[0][0] = seriesLabels[0][language];//'Day';
    simData[0][1] = seriesLabels[3][language];//'Empfängliche';
    simData[0][2] = seriesLabels[4][language];//'Ansteckende Infizierte';
    simData[0][3] = seriesLabels[5][language];//'Genesene/Verstorbene';
    simData[0][4] = seriesLabels[2][language];//'Patienten auf Intensivstation';
    simData[0][5] = seriesLabels[6][language];//'Umsetzung der Kontakteinschränkung';
    simData[0][6] = seriesLabels[1][language];//'Plätze auf Intensivstation';
    simData[0][7] = 'min Registered';
    simData[0][8] = 'max Registered';
    simData[0][9] = 'Empfängliche niedriges Risiko';
    simData[0][10] = 'Empfängliche hohes Risiko';
    simData[0][11] = 'Ansteckende Infizierte niedriges Risiko';
    simData[0][12] = 'Ansteckende Infizierte hohes Risiko';
    simData[0][13] = 'Patienten auf Intensivstation niedriges Risiko';
    simData[0][14] = 'Patienten auf Intensivstation hohes Risiko';
    simData[0][15] = seriesLabels[9][language];//"Verstorbene";
    simData[0][16] = "Verstorbene niedriges Risiko";
    simData[0][17] = "Verstorbene hohes Risiko";
    simData[0][18] = "min Verstorbene";
    simData[0][19] = "max Verstorbene";
    simData[0][20] = "Wirtschaftlicher Schaden [in Mrd. ]";
    simData[0][21] = "min wirtschaftlicher Schaden";
    simData[0][22] = "max wirtschaftlicher Schaden";
    simData[0][23] = seriesLabels[7][language];//'Vorgabe der Kontakteinschränkung';
    simData[0][24] = 'Registrierte Genesene';
    simData[0][25] = 'Registrierte Genesene low risk';
    simData[0][26] = 'Registrierte Genesene high risk';
    simData[0][27] = 'Empfängliche hohes Risiko nicht kompliant';
    simData[0][28] = 'Ansteckende Infizierte hohes Risiko nicht kompliant';
    simData[0][29] = 'Patienten auf Intensivstation hohes Risiko nicht kompliant';
    simData[0][30] = 'Verstorbene hohes Risiko nicht kompliant';
    simData[0][31] = 'Registrierte Genesene high risk nicht kompliant';
    simData[0][32] = seriesLabels[8][language];//'Gleitender Durchschnitt der Kontakteinschränkungen';
    simData[0][33] = 'Neuinfektionen';

    // set model parameters for simulation
    var alphaMod = [];
    var betaMod = [];
    var sus = [];
    var susLR = [];
    var susHR = [];
    var susHRnc = [];
    var inf = [];
    var infLR = [];
    var infHR = [];
    var infHRnc = [];
    var rec = [];
    var dec = [];
    var u = [];


    // set  variations for model parameters
    alphaMod[0] = alpha * (1 + modelUncertainty);
    alphaMod[1] = alpha * (1 - modelUncertainty);
    alphaMod[2] = alpha;
    alphaMod[3] = alpha;
    alphaMod[4] = alpha;

    betaMod[0] = beta;
    betaMod[1] = beta;
    betaMod[2] = beta * (1 + modelUncertainty);
    betaMod[3] = beta * (1 - modelUncertainty);
    betaMod[4] = beta;

    // initialize simulation data
    u[0] = 0;
    for (i = 1; i < T + 1; i++) {
        for (j = 0; j < 34; j++) {
            simData[i][j] = 0;
        }
        simData[i][7] = Npop;
        simData[i][18] = Npop;
        simData[i][6] = ICUcapacity + i * addCapacity;
        simData[i][21] = 1E10;
        u[i] = 0;
    }

    for (i = 0; i < 8; i++) {
        sus[i] = 0;
        susLR[i] = 0;
        susHR[i] = 0;
        susHRnc[i] = 0;
        inf[i] = 0;
        infLR[i] = 0;
        infHR[i] = 0;
        infHRnc[i] = 0;
        rec[i] = 0;
        dec[i] = 0;
    }


    herdImmunityAlwaysReached = true;
    startLevelAlwaysReached = true;
    iHerdImmunity = 0;
    iStartLevelReached = 0;

    for (cycle = 0; cycle < numberCycles; cycle++) {

        // initialize simulation variables
        simData[1][0] = 1;
        if (option == 0) simData[1][1] = Npop - initialInfected;
        if (option == 1 || option == 2) simData[1][1] = (Npop - initialInfected) * (1 - portionHighRisk);
        simData[1][2] = initialInfected * darkRatio;
        simData[1][3] = 0;
        simData[1][4] = null;
        simData[1][5] = upperLevel;
        simData[1][6] = ICUcapacity;
        simData[1][7] = 0;
        simData[1][8] = 0;
        simData[1][9] = (Npop - initialInfected) * (1 - portionHighRisk);
        simData[1][10] = (Npop - initialInfected) * portionHighRisk * ratioHighRiskCompliance;
        simData[1][27] = (Npop - initialInfected) * portionHighRisk * (1 - ratioHighRiskCompliance);
        console.log(simData[1][27]);
        simData[1][11] = initialInfected * (1 - portionHighRisk) * darkRatio;
        simData[1][12] = initialInfected * portionHighRisk * ratioHighRiskCompliance * darkRatio;
        simData[1][28] = initialInfected * portionHighRisk * (1 - ratioHighRiskCompliance) * darkRatio;
        simData[1][13] = null;
        simData[1][14] = null;
        simData[1][29] = null;
        simData[1][15] = 0;
        simData[1][16] = 0;
        simData[1][17] = 0;
        simData[1][18] = 0;
        simData[1][19] = 0;
        simData[1][20] = 0;
        simData[1][21] = 0;
        simData[1][22] = 0;
        simData[1][23] = 0;
        simData[1][24] = 0;
        simData[1][25] = 0;
        simData[1][26] = 0;
        simData[1][30] = 0;
        simData[1][31] = 0;
        simData[1][32] = lowerLevel;



        for (model = 0; model < 5; model++) {
            herdImmunityReached = false;
            startLevelReached = false;
            counter = 0;
            // calculate amount of infected and recovered for herd immunita
            nHerdImmunity = Npop - betaMod[model] * Npop / (alphaMod[model] * finalLevel);

            // loop over time steps
            for (i = 1; i < T; i++) {

                redPopOnly = ((option == 1 || option == 2) && (i <= endDate) && (i > 1));

                // determine relevant population (either entire population of population minus high-risk group)
                Nrel = Npop;
                if (option == 1 || option == 2) {
                    if (i <= endDate) Nrel = Npop * (1 - portionHighRisk * ratioHighRiskCompliance);
                    if (i == 1) {
                        simData[i][1] = Npop - initialInfected;
                        simData[i][9] = (Npop - initialInfected) * (1 - portionHighRisk);
                        simData[i][10] = (Npop - initialInfected) * portionHighRisk * ratioHighRiskCompliance;
                        simData[i][27] = (Npop - initialInfected) * portionHighRisk * (1 - ratioHighRiskCompliance);
                    }
                    if (i == 2) {
                        popSecured = simData[i][10];
                        simData[i][1] -= popSecured;
                        simData[i][10] -= popSecured;
                    }
                }

                simData[i][5] = upperLevel;
                simData[i + 1][5] = upperLevel;

                // choose the optimal interaction level

                // predictive model
                if (strategy == 3) {
                    if (i > delay - 1) {

                        // loop over all models
                        for (j = 0; j < 5; j++) {

                            // calculate impact on population

                            // initialize prediction
                            susLR[0] = simData[i - delay][9] * (1 + accuracyAntibodyTests);     // consider worst case 10% Error in susceptibles
                            susHR[0] = simData[i - delay][10] * (1 + accuracyAntibodyTests);    // consider worst case 10% Error in susceptibles
                            susHRnc[0] = simData[i - delay][27] * (1 + accuracyAntibodyTests);    // consider worst case 10% Error in susceptibles
                            sus[0] = susLR[0] + susHR[0] + susHRnc[0];

                            infLR[0] = simData[i][13] / (ratioLowRisk * (1 - uncertaintyRatios));       // consider worst case 10% error in ratio
                            infHR[0] = simData[i][14] / (ratioHighRisk * (1 - uncertaintyRatios));      // consider worst case 10% error in ratio
                            infHRnc[0] = simData[i][29] / (ratioHighRisk * (1 - uncertaintyRatios));      // consider worst case 10% error in ratio
                            inf[0] = infLR[0] + infHR[0] + infHRnc[0];

                            // simulate scenarios
                            for (k = 0; k < 2; k++) {
                                if (k == 0) u[i] = upperLevel;
                                else u[i] = lowerLevel;
                                for (l = 0; l < delay + 1; l++) {
                                    susLR[l + 1] = Math.round(susLR[l] - (u[l + i - delay] + uInaccur) * alphaMod[j] / Nrel * susLR[l] * inf[l]);
                                    susHRnc[l + 1] = Math.round(susHRnc[l] - (u[l + i - delay] + uInaccur) * alphaMod[j] / Nrel * susHRnc[l] * inf[l]);
                                    if (redPopOnly) susHR[l + 1] = susHR[l];
                                    else
                                        susHR[l + 1] = Math.round(susHR[l] - (u[l + i - delay] + uInaccur) * alphaMod[j] / Nrel * susHR[l] * inf[l]);
                                    sus[l + 1] = susLR[l + 1] + susHR[l + 1] + susHRnc[l + 1];

                                    infLR[l + 1] = Math.round(infLR[l] + (u[l + i - delay] + uInaccur) * alphaMod[j] / Nrel * susLR[l] * inf[l] - betaMod[j] * infLR[l]);
                                    infHRnc[l + 1] = Math.round(infHRnc[l] + (u[l + i - delay] + uInaccur) * alphaMod[j] / Nrel * susHRnc[l] * inf[l] - betaMod[j] * infHRnc[l]);
                                    if (redPopOnly) infHR[l + 1] = infHR[l] - betaMod[j] * infHR[l];
                                    else
                                        infHR[l + 1] = Math.round(infHR[l] + (u[l + i - delay] + uInaccur) * alphaMod[j] / Nrel * susHR[l] * inf[l] - betaMod[j] * infHR[l]);
                                    inf[l + 1] = infLR[l + 1] + infHR[l + 1] + infHRnc[l + 1];
                                }
                                if (infLR[delay + 1] * ratioLowRisk + (infHR[delay + 1] + infHRnc[delay + 1]) * ratioHighRisk > simData[i + 1][6]) simData[i][5] = lowerLevel;
                            }
                        }
                    }
                    else simData[i][5] = lowerLevel;
                }

                if (herdImmunityReached && counter <= 21 && option == 2) {
                    simData[i][5] = 0.2;
                    counter++;
                }

                // measures base on current infection rate
                if (strategy == 4) {
                    if (i < delay + 7) simData[i][5] = lowerLevel;
                    else {
                        // count new infections in last 7 days
                        newInfections = 0;
                        for (j = 0; j < 7; j++) newInfections += simData[i - delay - j][33];
                        //console.log(newInfections);
                        //if (simData[i - delay][2] - simData[i - delay - 7][2] < Npop / 100000 * 50) simData[i][5] = upperLevel;
                        if (newInfections / darkRatio < (Npop / 100000) * 50) simData[i][5] = upperLevel;
                        else simData[i][5] = lowerLevel;
                    }
                }

                if (i > endDate) {
                    simData[i][5] = finalLevel;
                }

                // if end date is reached, add the high-risk group to the susceptibles
                if (i == endDate && (option == 1 || option == 2)) simData[i][10] += popSecured;//Npop * portionHighRisk * ratioHighRiskCompliance;

                if (strategy == 0) simData[i][5] = 1;



                if (i == T) simData[i][5] = simData[i - 1][5];

                u[i] = simData[i][5];
                simData[i][23] = u[i];
                simData[i][5] += 2 * (Math.random() - 0.5) * uInaccur;
                if (simData[i][5] < 0) simData[i][5] = 0;

                // assure consistens display of last data point
                simData[i + 1][23] = simData[i][23];
                simData[i + 1][5] = simData[i][5];

                simData[i + 1][0] = i + 1;
                simData[i + 1][4] = 0;

                // determine rolling average of contacts
                if (i > 1) {
                    if (i < 15)
                        simData[i][32] = simData[i - 1][32] + simData[i][5] / 14 - simData[1][5] / 14;
                    else
                        simData[i][32] = simData[i - 1][32] + simData[i][5] / 14 - simData[i - 14][5] / 14;
                }
                else simData[i][32] = simData[1][5];

                simData[i + 1][32] = simData[i][32];

                // determine new number of susceptibles
                simData[i + 1][9] = Math.round(simData[i][9] - alphaMod[model] / Nrel * simData[i][5] * simData[i][9] * simData[i][2]);
                simData[i + 1][27] = Math.round(simData[i][27] - alphaMod[model] / Nrel * simData[i][5] * simData[i][27] * simData[i][2]);
                if (redPopOnly) simData[i + 1][10] = simData[i][10];
                else simData[i + 1][10] = Math.round(simData[i][10] - alphaMod[model] / Nrel * simData[i][5] * simData[i][10] * simData[i][2]);
                simData[i + 1][1] = simData[i + 1][9] + simData[i + 1][10] + simData[i + 1][27];

                // determine new number of infected
                simData[i + 1][11] = Math.round(simData[i][11] + alphaMod[model] / Nrel * simData[i][5] * simData[i][9] * simData[i][2] - betaMod[model] * simData[i][11]);
                simData[i + 1][28] = Math.round(simData[i][28] + alphaMod[model] / Nrel * simData[i][5] * simData[i][27] * simData[i][2] - betaMod[model] * simData[i][28]);

                simData[i + 1][33] = Math.round(alphaMod[model] / Nrel * simData[i][5] * simData[i][9] * simData[i][2] + alphaMod[model] / Nrel * simData[i][5] * simData[i][27] * simData[i][2]);
                if (!redPopOnly) simData[i + 1][33] += alphaMod[model] / Nrel * simData[i][5] * simData[i][10] * simData[i][2];

                if (redPopOnly) simData[i + 1][12] = simData[i][12] - betaMod[model] * simData[i][12];
                else
                    simData[i + 1][12] = Math.round(simData[i][12] + alphaMod[model] / Nrel * simData[i][5] * simData[i][10] * simData[i][2] - betaMod[model] * simData[i][12]);

                simData[i + 1][2] = simData[i + 1][11] + simData[i + 1][12] + simData[i + 1][28];

                // determine new number of recovered
                simData[i + 1][3] = Math.round(simData[i][3] + betaMod[model] * simData[i][2]);

                // determine new number of registered
                if (i > delay - 1) {
                    simData[i + 1][13] = Math.round(ratioLowRisk * (1 + 2 * (Math.random() - 0.5) * accuracyAntibodyTests) / darkRatio * simData[i + 1 - delay][11]);
                    simData[i + 1][14] = Math.round(ratioHighRisk * (1 + 2 * (Math.random() - 0.5) * accuracyAntibodyTests) / darkRatio * simData[i + 1 - delay][12]);
                    simData[i + 1][29] = Math.round(ratioHighRisk * (1 + 2 * (Math.random() - 0.5) * accuracyAntibodyTests) / darkRatio * simData[i + 1 - delay][28]);
                    simData[i + 1][4] = simData[i + 1][13] + simData[i + 1][14] + simData[i + 1][29];
                }
                else {
                    simData[i + 1][13] = null;
                    simData[i + 1][14] = null;
                    simData[i + 1][29] = null;
                    simData[i + 1][4] = null;
                }

                // determine number of registered recovered


                // determine new number of deceased
                // in case capacity is sufficient
                if (simData[i + 1][6] > simData[i + 1][4])
                    simData[i + 1][15] = Math.round(simData[i][15] + simData[i + 1][4] * betaMod[model] * 0.29);
                else
                    simData[i + 1][15] = Math.round(simData[i][15] + simData[i + 1][6] * betaMod[model] * 0.29 + (simData[i + 1][4] - simData[i + 1][6]) * betaMod[model]);

                // determine economic impact
                if (simData[i][23] <= 0.2) simData[i + 1][20] = simData[i][20] + 5;
                if (simData[i][23] > 0.2 && simData[i][23] < 0.9)
                    //simData[i + 1][20] = simData[i][20] + (1 - (3 * Math.pow((simData[i][5] - 0.2) / 0.7, 2) - 2 * Math.pow((simData[i][5] - 0.2) / 0.7, 3))) * 5;
                    simData[i + 1][20] = simData[i][20] + 5 * (1 - (simData[i][23] - 0.2) / 0.7);
                if (simData[i][23] >= 0.9) simData[i + 1][20] = simData[i][20];

                // update min and max values
                if (simData[i + 1][4] > simData[i + 1][8]) simData[i + 1][8] = simData[i + 1][4];
                if (simData[i + 1][4] < simData[i + 1][7]) simData[i + 1][7] = simData[i + 1][4];

                if (simData[i + 1][15] > simData[i + 1][19]) simData[i + 1][19] = simData[i + 1][15];
                if (simData[i + 1][15] < simData[i + 1][18]) simData[i + 1][18] = simData[i + 1][15];

                if (simData[i + 1][20] > simData[i + 1][22]) simData[i + 1][22] = simData[i + 1][20];
                if (simData[i + 1][20] < simData[i + 1][21]) simData[i + 1][21] = simData[i + 1][20];

                // check if herd immunity has been reached for final level of interaction
                if (simData[i + 1][2] + simData[i + 1][3] > nHerdImmunity && !herdImmunityReached) {
                    herdImmunityReached = true;
                    if (i + 1 > iHerdImmunity) iHerdImmunity = i + 1;
                }

                // check if start level is reached (only if herd immunity is reached)
                if (herdImmunityReached && simData[i + 1][2] < initialInfected && !startLevelReached) {
                    startLevelReached = true;
                    if (i + 1 > iStartLevelReached) iStartLevelReached = i + 1;
                }
            }
            // if herd immunity was not reached for the current model is was not always reached
            if (!herdImmunityReached) herdImmunityAlwaysReached = false;
            if (!startLevelReached) startLevelAlwaysReached = false;
        }
    }

    // extract data for overview
    var viewData1 = [];
    for (i = 0; i < T + 1; i++) {
        viewData1[i] = [];
    }
    for (i = 0; i < T + 1; i++) {
        for (j = 0; j < 4; j++) {
            viewData1[i][j] = simData[i][j];
        }
    }

    // extract data for overview
    var viewData2 = [];
    for (i = 0; i < T + 1; i++) {
        viewData2[i] = [];
    }

    for (i = 0; i < T + 1; i++) {
        viewData2[i][0] = simData[i][0];
        viewData2[i][1] = simData[i][6];
        viewData2[i][2] = simData[i][7];
        viewData2[i][3] = simData[i][4];
        viewData2[i][4] = simData[i][8];
        if (i > 0) {
            viewData2[i][2] = simData[i][7] - simData[i][6];
            viewData2[i][3] = simData[i][4] - simData[i][7];
            viewData2[i][4] = simData[i][8] - simData[i][4];
        }
    }

    var viewData3 = [];
    for (i = 0; i < T + 1; i++) {
        viewData3[i] = [];
    }
    for (i = 0; i < T + 1; i++) {
        viewData3[i][0] = simData[i][0];
        viewData3[i][1] = simData[i][5];
        viewData3[i][2] = simData[i][32];
        viewData3[i][3] = simData[i][23];
        if (i > 0) {
            viewData3[i][1] = (-viewData3[i][1] + 1);
            viewData3[i][2] = (-viewData3[i][2] + 1);
            viewData3[i][3] = (-viewData3[i][3] + 1);
        }
    }

    var viewData4 = [];
    for (i = 0; i < T + 1; i++) {
        viewData4[i] = [];
    }
    for (i = 0; i < T + 1; i++) {
        viewData4[i][0] = simData[i][0];
        viewData4[i][1] = simData[i][18];
        viewData4[i][2] = simData[i][15];
        viewData4[i][3] = simData[i][19];
        if (i > 0) {
            viewData4[i][1] = simData[i][18];
            viewData4[i][2] = simData[i][15] - simData[i][18];
            viewData4[i][3] = simData[i][19] - simData[i][15];
        }
    }


    // gather data for evaluation of economic impact
    var viewData5 = [];
    for (i = 0; i < T + 1; i++) {
        viewData5[i] = [];
    }
    for (i = 0; i < T + 1; i++) {
        viewData5[i][0] = simData[i][0];
        viewData5[i][1] = simData[i][21];
        viewData5[i][2] = simData[i][20];
        viewData5[i][3] = simData[i][22];
        if (i > 0) {
            viewData5[i][1] = simData[i][21];
            viewData5[i][2] = simData[i][20] - simData[i][21];
            viewData5[i][3] = simData[i][22] - simData[i][20];
        }
    }

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

        var data = google.visualization.arrayToDataTable(viewData1);

        // add annotations
        data.insertColumn(4, { type: 'string', role: 'annotationText' });
        data.insertColumn(4, { type: 'string', role: 'annotation' });

        data.insertColumn(3, { type: 'string', role: 'annotationText' });
        data.insertColumn(3, { type: 'string', role: 'annotation' });

        data.insertColumn(2, { type: 'string', role: 'annotationText' });
        data.insertColumn(2, { type: 'string', role: 'annotation' });

        data.addColumn({ type: 'string', role: 'annotation' });
        data.addColumn({ type: 'string', role: 'annotationText' });

        if (option == 1 || option == 2) {
            data.setCell(1, 2, 'Empfägliche (susceptible)', graphAnnotations[0][language]);
            data.setCell(endDate, 2, 'Empfägliche (susceptible)', graphAnnotations[1][language]);
        }


        if (herdImmunityAlwaysReached) data.setCell(iHerdImmunity, 8, 'Genesene (recovered)', graphAnnotations[2][language]);
        else data.setCell(T - 2, 8, 'Genesene (recovered)', graphAnnotations[3][language]);

        if (startLevelAlwaysReached) data.setCell(iStartLevelReached, 5, 'Infizierte (infected)', graphAnnotations[4][language]);
        else data.setCell(T - 2, 5, 'Infizierte (infected)', graphAnnotations[5][language]);

        var options = {
            title: titles[1][language],
            curveType: 'none',
            fontSize: graphFontSize,
            legend: { position: 'bottom' },
            hAxis: {
                title: seriesLabels[0][language],
            },
            vAxes: {
                0: { format: 'short', type: "line", targetAxisIndex: 0 },
                1: { format: 'short', type: "line", targetAxisIndex: 1 },
            },
            series: {
                0: { targetAxisIndex: 0, annotations: { style: { type: 'line', }, stem: { length: 50, color: '#3366CC' } }, interpolateNulls: false },
                1: { targetAxisIndex: 0, annotations: { style: { type: 'line', }, stem: { length: 20, color: '#DC3912' } }, interpolateNulls: false },
                2: { targetAxisIndex: 0, annotations: { style: { type: 'line', }, stem: { length: 50, color: '#FF9900' } }, interpolateNulls: false }
            },
            backgroundColor: { stroke: 'black', strokeWidth: 2 },
        };


        var chart = new google.visualization.ComboChart(document.getElementById('curve_chart'));
        chart.draw(data, options);

        var data2 = google.visualization.arrayToDataTable(viewData2);
        var options2 = {
            title: titles[0][language],
            curveType: 'none',
            fontSize: graphFontSize,
            legend: { position: 'bottom' },
            vAxes: {
                0: { format: 'short' }
            },
            isStacked: 'true',
            hAxis: {
                title: seriesLabels[0][language],

            },
            seriesType: 'area',
            enableInteractivity: false,
            series: {
                0: { targetAxisIndex: 0, color: '#DC3912', lineWidth: 2, areaOpacity: 0, interpolateNulls: false },
                1: { targetAxisIndex: 0, color: '#3366CC', lineWidth: 0, areaOpacity: 0, visibleInLegend: false, interpolateNulls: false },
                2: { targetAxisIndex: 0, color: '#3366CC', lineWidth: 2, areaOpacity: 0.2, interpolateNulls: false },
                3: { targetAxisIndex: 0, color: '#3366CC', lineWidth: 0, areaOpacity: 0.2, visibleInLegend: false, interpolateNulls: false },
            },
            backgroundColor: 'white',
            backgroundColor: { stroke: 'black', strokeWidth: 2 },
        };

        var chart2 = new google.visualization.ComboChart(document.getElementById('curve_chart_2'));
        chart2.draw(data2, options2);



        var data3 = google.visualization.arrayToDataTable(viewData3);
        var options3 = {
            title: titles[2][language],
            curveType: 'none',
            fontSize: graphFontSize,
            legend: { position: 'bottom' },
            vAxes: {
                0: { format: '#.###%' }
            },
            hAxis: {
                title: seriesLabels[0][language],
            },
            series: {
                0: { targetAxisIndex: 0, color: '#3366CC', lineWidth: 2, areaOpacity: 0 },
                1: { targetAxisIndex: 0, color: '#DC3912', lineWidth: 2, areaOpacity: 0 },
                2: { targetAxisIndex: 0, color: '#FF9900', lineWidth: 2, areaOpacity: 0 },
            },
            vAxis: {
                viewWindowMode: 'explicit',
                viewWindow: {
                    max: 1,
                    min: 0
                }
            },
            backgroundColor: { stroke: 'black', strokeWidth: 2 },
        };
        var chart3 = new google.visualization.ComboChart(document.getElementById('curve_chart_3'));
        chart3.draw(data3, options3);


        var data4 = google.visualization.arrayToDataTable(viewData4);
        var options4 = {
            title: titles[3][language],
            curveType: 'none',
            fontSize: graphFontSize,
            legend: { position: 'bottom' },
            vAxes: {
                0: { format: 'short' },
                1: { format: 'short', minValue: 0, maxValue: 1 }
            },
            isStacked: 'true',
            hAxis: {
                title: seriesLabels[0][language],
            },
            seriesType: 'area',
            enableInteractivity: false,
            series: {
                0: { targetAxisIndex: 0, color: '#3366CC', lineWidth: 0, areaOpacity: 0, visibleInLegend: false },
                1: { targetAxisIndex: 0, color: '#3366CC', lineWidth: 2, areaOpacity: 0.2 },
                2: { targetAxisIndex: 0, color: '#3366CC', lineWidth: 0, areaOpacity: 0.2, visibleInLegend: false },
            },
            backgroundColor: { stroke: 'black', strokeWidth: 2 },
        };
        var chart4 = new google.visualization.ComboChart(document.getElementById('curve_chart_4'));
        chart4.draw(data4, options4);
    }
}