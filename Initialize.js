"use strict";

//document.addEventListener('DOMContentLoaded', (event) => {
    let v_tek = 0; // текущая скорость (м/с)
    let t_NZspeed = 1; // Время движения (с)
    let mileage = 0; // Пробег (м)
    let v_tek_ind = 0; // Текущая скорость (км/ч)
    let page = 1; // Текущая страница
    let ch_e_flag = false; // Предупреждение
    let fuel = 60000; // Остаток топлива (мл)
    const MAX_V = 60000; // Объём топливного бака (мл)
    let milage_km = 0; // Пробег (км)
    let v_sred = 0; // Средняя скорость (км/ч)
    let flush = false; // Признак мерцания
    let test_rjm = false; // Тестовый режим
    let err_1 = false; // Ошибка двигателя 1
    let err_2 = false; // Ошибка двигателя 2
    let test_rej = false; // Тестовый режим
    let fuel_ost = 60000; // Остаток топлива (мл)

    refreshDI();

// Req: IB.1
    function pagination() 
    {
        let pages = ["", "page_1", "page_2", "page_3"];

        for (let i = 1; i < pages.length; i++) { document.getElementById(pages[i]).style.visibility = (i == page) ? "visible" : "hidden"; }
    }
    

// Req: IB.3
    function speedIndication() 
    {
        if (page == 1) {
            if (v_tek_ind <= 0) {
                v_tek_ind = 0;
            } else {
                if (v_tek_ind < 10) {
                    v_tek_ind = v_tek_ind.toFixed(2);
                } else {
                    if (v_tek_ind < 180) {
                        v_tek_ind = v_tek_ind.toFixed(1);
                    } else {
                        v_tek_ind = 180;
                    }
                }
            }

            document.getElementById('speed').innerHTML = v_tek_ind + " км/ч";
        }
    }

// Req: IB.4
    function checkEngineIndication() 
    {       
        document.getElementById("check").style.visibility = (page == 1 && ch_e_flag === true) ? "visible" : "hidden";
    }

// Req: IB.5
    function fuelOstIndication() {
        if (page == 1) {
            let elements_n = ["", "N_1", "N_2", "N_3", "N_4", "N_5", "N_6", "N_7", "N_8", "N_9", "N_10"];

            for (let i = 1; i < elements_n.length; i++) {document.getElementById(elements_n[i]).style.color = (i > Math.round(10 * fuel / MAX_V)) ? "black" : "white"; }
        }
    }

// Req: IB.7
    function averageSpeedIndication() 
    {
        if (page == 2) {
            if (v_sred <= 0) {
                v_sred = 0;
            } else {
                if (v_sred < 10) {
                    v_sred = Number(v_sred).toFixed(2);
                } else {
                    if (v_sred < 180) {
                        v_sred = Number(v_sred).toFixed(1);
                    } else {
                        v_sred = 180;
                    }
                }
            }

            document.getElementById('v_sred').innerHTML = v_sred + " км/ч";
        }
    }

// Req: IB.8
    function mileageIndication() 
    {
        if (page == 2) {
            let zeros = ["", "0", "00", "000", "0000", "00000", "000000"];
            milage_km = Number(milage_km).toFixed(1);
            let count_0 = 8 - milage_km.length;
            document.getElementById('milage_km').innerHTML = zeros[count_0] + milage_km + " км";
        }
    }

// Req: IB.10
    function infoIndication() 
    {
        if (page == 3) {
            if (ch_e_flag === true) {
                document.getElementById('mes').innerHTML = "Обраьтитесь в сервисный центр";
                document.getElementById('mes').style.margin = "40.5px 0px";
            } else {
                document.getElementById('mes').innerHTML = "ОК";
                document.getElementById('mes').style.margin = "52px 0px";
            }

            document.getElementById('mes').style.animation = (flush === true) ? "color_change .5s infinite" : "";

            if (test_rjm === true) {
                document.getElementById('T').innerHTML = "T";
            } else {
                document.getElementById('T').innerHTML = "";
            }
        }
    }

    function refreshDI() 
    {
        pagination();
        speedIndication();
        checkEngineIndication();
        fuelOstIndication();
        averageSpeedIndication();
        mileageIndication();
        infoIndication();
    }

// Req: IPC.1
    function nextPage() 
    {
        page = page + 1;
        if (page > 3) { page = 1; }
        refreshDI();
    }

// Req: IPC.2
    function VTekIndCalc()
    {
        v_tek = document.getElementById('v_tek').value;

        v_tek_ind = v_tek * 3.6;

        refreshDI();
    }

// Req: IPC.3
    function ErrorFinder()
    {
        if (document.getElementById('err_1').checked) {err_1 = true} else {err_1 = false}
        if (document.getElementById('err_2').checked) {err_2 = true} else {err_2 = false}
        if (document.getElementById('test_rej').checked) {test_rej = true} else {test_rej = false}

        ch_e_flag = (err_1 || err_2) && !test_rej;

        refreshDI();
    }

// Req: IPC.4
    function Retranslation()
    {
        fuel_ost = document.getElementById('fuel_ost').value;
        fuel = fuel_ost;
        
        mileage = document.getElementById('mileage').value;
        milage_km = (mileage / 1000.0).toFixed(1);
        
        flush = err_1 && err_2;

        if (document.getElementById('test_rej').checked) {test_rej = true} else {test_rej = false}
        test_rjm = test_rej;
        
        refreshDI();
    }

// Req: IPC.5
        function VSredCalc()
        {
            t_NZspeed = document.getElementById('t_NZspeed').value;
            v_sred = mileage / t_NZspeed * 3.6;
    
            refreshDI();
        }

    document.getElementById('nextBtn').addEventListener('click', nextPage);
    document.getElementById('v_tek').addEventListener('change', VTekIndCalc);
    document.getElementById('err_1').addEventListener('change', function() { ErrorFinder(); Retranslation(); });
    document.getElementById('err_2').addEventListener('change', function() { ErrorFinder(); Retranslation(); });
    document.getElementById('test_rej').addEventListener('change', ErrorFinder);
    document.getElementById('fuel_ost').addEventListener('change', Retranslation);
    document.getElementById('mileage').addEventListener('change', function() { Retranslation(); VSredCalc(); });
    document.getElementById('t_NZspeed').addEventListener('change', function() { Retranslation(); VSredCalc(); });
    document.getElementById('test_rej').addEventListener('change', Retranslation);
//});
