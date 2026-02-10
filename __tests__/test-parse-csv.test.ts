const csvString = 
`03.02.2025;ONLINE BANKING VOM 03.02 UM 09:27 Recipient: Andreas Ragg, Marie-Sophie Ragg Payment reference: Semesterticket Recipient IBAN: AT981200026323199100 Recipient BIC: BKAUATWWXXX;03.02.2025;-75,00;EUR;03.02.2025 09:27:19:616
03.02.2025;Payment recipient: A1 Telekom Austria Aktiengesellschaft Purpose of use: ------- A1 TELEKOM - YESSS. -------400001306018 Payment recipient IBAN: AT791200008353193909 Payment recipient BIC: BKAUATWWXXX Recipient ID: AT57ZZZ00000001044 Client reference: 130022984784 Mandate: 8000010366011, 09.01.2025;03.02.2025;-9,98;EUR;03.02.2025 02:11:02:563
04.02.2025;Purpose of use: RIESNERALM-HOCHSITZ IRDNING DONNE 8953 Payment reference: POS          22,00 AT  D3   03.02. 14:03 Card sequence no: 3;03.02.2025;-22,00;EUR;04.02.2025 12:43:29:946`

import { keywordSearch, keywordSearchForField, parseCsv, regexSearchForField } from "@/functions/csvParsing";

describe("csv parsing", () => {
    test("keywordSearchForField", () => {
        const cols = ["03.02.2025", "ONLINE BANKING VOM 03.02 UM 09:27 Recipient: Andreas Ragg, Marie-Sophie Ragg Payment reference: Semesterticket Recipient IBAN: AT981200026323199100 Recipient BIC: BKAUATWWXXX", "Empfänger: testempf"];
        expect(keywordSearchForField('beneficiary', cols)).toEqual('Andreas Ragg, Marie-Sophie Ragg');
        expect(cols).toEqual([
            '03.02.2025',
            'ONLINE BANKING VOM 03.02 UM 09:27',
            'Payment reference: Semesterticket Recipient IBAN: AT981200026323199100 Recipient BIC: BKAUATWWXXX',
            'Empfänger: testempf'
        ]);
    })
    
    test("keywordSearch", () => {
        const cols = ["03.02.2025", "ONLINE BANKING VOM 03.02 UM 09:27 Recipient: Andreas Ragg, Marie-Sophie Ragg Payment reference: Semesterticket Recipient IBAN: AT981200026323199100 Recipient BIC: BKAUATWWXXX", "Empfänger: testempf"];
        expect(keywordSearch(cols)).toEqual({
            beneficiary: 'Andreas Ragg, Marie-Sophie Ragg',
            payment_reference: 'Semesterticket'
        });
        expect(cols).toEqual([
            '03.02.2025',
            'ONLINE BANKING VOM 03.02 UM 09:27',
            'Recipient IBAN: AT981200026323199100 Recipient BIC: BKAUATWWXXX',
            'Empfänger: testempf'
        ])
    })

    test("regexSearch", () => {
        const cols = ["03.02.2025", "ONLINE BANKING VOM 03.02 UM 09:27 Recipient: Andreas Ragg, Marie-Sophie Ragg Payment reference: Semesterticket Recipient IBAN: AT981200026323199100 Recipient BIC: BKAUATWWXXX", "Empfänger: testempf","4.433,04","EUR"];
        expect(regexSearchForField("amount", cols)).toEqual("4433.04");
        const cols1 = ["03.02.2025", "ONLINE BANKING VOM 03.02 UM 09:27 Recipient: Andreas Ragg, Marie-Sophie Ragg Payment reference: Semesterticket Recipient IBAN: AT981200026323199100 Recipient BIC: BKAUATWWXXX", "Empfänger: testempf","4.433,04","EUR"];
        expect(regexSearchForField("currency",cols1)).toEqual("EUR");
        const cols2 = ["03.02.2025", "ONLINE BANKING VOM 03.02 UM 09:27 Recipient: Andreas Ragg, Marie-Sophie Ragg Payment reference: Semesterticket Recipient IBAN: AT981200026323199100 Recipient BIC: BKAUATWWXXX", "Empfänger: testempf","4.433,04","EUR"];
        expect(regexSearchForField("timestamp",cols2)).toEqual("2025-02-02T23:00:00.000Z");
        const cols3 = ["04.02.2025","Purpose of use: RIESNERALM-HOCHSITZ IRDNING DONNE 8953 Payment reference: POS          22,00 AT  D3   03.02. 14:03 Card sequence no: 3","03.02.2025","-22,00","EUR","04.02.2025 12:43:29:946"];
        expect(regexSearchForField("timestamp",cols3)).toEqual("2025-02-04T11:43:29.946Z");
    })

    test("csv parser", () => {
        expect(parseCsv(csvString)).toEqual([
      expect.objectContaining({
        id: expect.anything(),
        name: 'Semesterticket',
        amount: '-75.00',
        timestamp: '2025-02-03T08:27:19.616Z',
        further_information: '03.02.2025;ONLINE BANKING VOM 03.02 UM 09:27;Recipient IBAN: AT981200026323199100 Recipient BIC: BKAUATWWXXX;03.02.2025',
        currency: 'EUR',
        beneficiary: 'Andreas Ragg, Marie-Sophie Ragg',
        payment_reference: 'Semesterticket'
      }),
      expect.objectContaining({
        id: expect.anything(),
        name: '------- A1 TELEKOM - YESSS. -------400001306018',
        amount: '-9.98',
        timestamp: '2025-02-03T01:11:02.563Z',
        further_information: '03.02.2025;Payment recipient IBAN: AT791200008353193909 Payment recipient BIC: BKAUATWWXXX Recipient ID: AT57ZZZ00000001044 Client reference: 130022984784 Mandate: 8000010366011, 09.01.2025;03.02.2025',
        currency: 'EUR',
        beneficiary: 'A1 Telekom Austria Aktiengesellschaft',
        payment_reference: '------- A1 TELEKOM - YESSS. -------400001306018'
      }),
      expect.objectContaining({
        id: expect.anything(),
        name: 'RIESNERALM-HOCHSITZ IRDNING DONNE 8953',
        amount: '-22.00',
        timestamp: '2025-02-04T11:43:29.946Z',
        further_information: '04.02.2025;Payment reference: POS          22,00 AT  D3   03.02. 14:03 Card sequence no: 3;03.02.2025',
        currency: 'EUR',
        beneficiary: '',
        payment_reference: 'RIESNERALM-HOCHSITZ IRDNING DONNE 8953'
      })
    ]);
    })
    test("bawag csv parser",() => {
        const bawagStr = `AT811400002110139228;Abbuchung Onlinebanking                      BG/000003091|BAWAATWWXXX AT301400002116059765 SparBox Flex;17.11.2025;15.11.2025;-80,00;EUR
AT811400002110139228;Bezahlung Karte                              MC/000003092|POS          4350  K001 14.11. 15:35|BIPA DANKT 0301981\\\\WIEN\\1190;17.11.2025;14.11.2025;-10,98;EUR`;
        expect(parseCsv(bawagStr)).toEqual([
            expect.objectContaining({
                id: expect.anything(),
                name: 'AT811400002110139228;Abbuchung Onlinebanking                      BG/000003091|BAWAATWWXXX AT301400002116059765 SparBox Flex;15.11.2025',
                amount: '-80.00',
                timestamp: '2025-11-16T23:00:00.000Z',
                currency: 'EUR',
                beneficiary: '',
                payment_reference: '',
                further_information: 'AT811400002110139228;Abbuchung Onlinebanking                      BG/000003091|BAWAATWWXXX AT301400002116059765 SparBox Flex;15.11.2025'
            }),
            expect.objectContaining({
                id: expect.anything(),
                name: 'AT811400002110139228;Bezahlung Karte                              MC/000003092|POS          4350  K001 14.11. 15:35|BIPA DANKT 0301981\\\\WIEN\\1190;14.11.2025',
                amount: '-10.98',
                timestamp: '2025-11-16T23:00:00.000Z',
                currency: 'EUR',
                beneficiary: '',
                payment_reference: '',
                further_information: 'AT811400002110139228;Bezahlung Karte                              MC/000003092|POS          4350  K001 14.11. 15:35|BIPA DANKT 0301981\\\\WIEN\\1190;14.11.2025'
            })
            ]
        );
    });
})