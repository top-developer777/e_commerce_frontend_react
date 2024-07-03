import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import { Content } from '../../../_metronic/layout/components/content'
import { ChartComponent } from './components/ChartComponent'

// const currentDate = new Date();

// const options: Intl.DateTimeFormatOptions = {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric'
// };

// const formattedDate = currentDate.toLocaleDateString('en-GB', options);

// console.log(formattedDate);

const fakeDashboard = [
  {
    "title": "Today",
    "date": "6/12, 2024",
    "sales": "1525.80",
    "orders_units": "105 / 120",
    "refunds": "0",
    "adv_cost": "0.00",
    "est_payout": "1525.50",
    "gross_profit": "1180.51",
    "net_profit": "1180.51"
  },
  {
    "title": "Today",
    "date": "6/12, 2024",
    "sales": "1525.80",
    "orders_units": "105 / 120",
    "refunds": "0",
    "adv_cost": "0.00",
    "est_payout": "1525.50",
    "gross_profit": "1180.51",
    "net_profit": "1180.51"
  },
  {
    "title": "Today",
    "date": "6/12, 2024",
    "sales": "1525.80",
    "orders_units": "105 / 120",
    "refunds": "0",
    "adv_cost": "0.00",
    "est_payout": "1525.50",
    "gross_profit": "1180.51",
    "net_profit": "1180.51"
  },
  {
    "title": "Today",
    "date": "6/12, 2024",
    "sales": "1525.80",
    "orders_units": "105 / 120",
    "refunds": "0",
    "adv_cost": "0.00",
    "est_payout": "1525.50",
    "gross_profit": "1180.51",
    "net_profit": "1180.51"
  },
  {
    "title": "Today",
    "date": "6/12, 2024",
    "sales": "1525.80",
    "orders_units": "105 / 120",
    "refunds": "0",
    "adv_cost": "0.00",
    "est_payout": "1525.50",
    "gross_profit": "1180.51",
    "net_profit": "1180.51"
  }
]

const fakeProducts = [
  {
    "admin_user": "theinnovatorssrl@gmail.com",
    "part_number_key": "D33HD4MBM",
    "brand_name": "Elindor",
    "category_id": 3514,
    "brand": "Elindor",
    "name": "Lampa LED birou, incarcare wireless pentru IOS Android, 5 moduri lumina rece/calda si 10 intensitati, control tactil, ajustabila, USB, 450lm, Negru mat",
    "part_number": "1",
    "sale_price": "121.8400",
    "currency": "RON",
    "url": "",
    "warranty": 0,
    "general_stock": 139,
    "weight": "0.000000",
    "status": 1,
    "recommended_price": null,
    "images": "[{\"url\": \"https://marketplace-static.emag.ro/resources/000/033/859/907/33859907.png\", \"display_type\": 1}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/039/066/170/39066170.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/849/38123849.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/862/38123862.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/865/38123865.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/868/38123868.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/869/38123869.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/897/38123897.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/038/123/901/38123901.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/036/424/415/36424415.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/034/576/427/34576427.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/034/192/379/34192379.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/744/313/33744313.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/714/109/33714109.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/714/110/33714110.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/661/692/33661692.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/661/700/33661700.png\", \"display_type\": 2}]",
    "attachments": "[]",
    "vat_id": 1,
    "family": "{\"id\": 8, \"name\": \"Lampa LED birou, incarcare wireless pentru IOS Android, 5 moduri lumina rece/calda\", \"family_type_id\": 219}",
    "reversible_vat_charging": false,
    "min_sale_price": "1.0000",
    "max_sale_price": "100387.5800",
    "offer_details": "{\"id\": 42840257, \"warranty_type\": 1, \"supply_lead_time\": 14, \"emag_club\": 1}",
    "availability": "[{\"value\": 3}]",
    "stock": "[{\"value\": 139}]",
    "handling_time": "[{\"value\": 0}]",
    "ean": "[\"0741718382513\"]",
    "commission": null,
    "validation_status": "[{\"value\": 9, \"description\": \"Approved documentation\", \"errors\": null}]",
    "translation_validation_status": "[{\"value\": 9, \"description\": \"Approved documentation\", \"errors\": null}]",
    "offer_validation_status": "{\"value\": 1, \"description\": \"Saleable\", \"errors\": null}",
    "auto_translated": 0,
    "ownership": true,
    "best_offer_sale_price": "121.8400",
    "best_offer_recommended_price": "121.8400",
    "number_of_offers": 1,
    "genius_eligibility": 1,
    "recyclewarranties": 0,
    "id": 1,
    "units_sold": 8,
    "refunds": 2,
    "sales": 1992.09,
    "ads": 108.22,
    "sellable_return": 0,
    "gross_profit": 220.9,
    "net_profit": 220.9,
    "margin": 92,
    "roi": 510,
  },
  {
    "admin_user": "theinnovatorssrl@gmail.com",
    "part_number_key": "DRM054MBM",
    "brand_name": "OEM",
    "buy_button_rank": 1,
    "category_id": 3268,
    "brand": "OEM",
    "name": "Mini Umidificator de aer cu difuzor aromaterapie si lumini LED, portabil, USB, rezervor 220 ml, 2 moduri de functionare, lumini de noapte, umidificator camera si masina auto, Alb",
    "part_number": "85-2",
    "sale_price": "42.0100",
    "currency": "RON",
    "description": "<p>&nbsp;</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p>&nbsp;</p>",
    "url": "",
    "warranty": 0,
    "general_stock": 48,
    "weight": "0.000000",
    "status": 1,
    "recommended_price": null,
    "images": "[{\"url\": \"https://marketplace-static.emag.ro/resources/000/039/390/178/39390178.png\", \"display_type\": 1}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/946/33582946.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/947/33582947.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/948/33582948.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/949/33582949.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/950/33582950.png\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/951/33582951.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/952/33582952.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/953/33582953.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/954/33582954.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/955/33582955.jpg\", \"display_type\": 0}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/956/33582956.jpg\", \"display_type\": 0}]",
    "attachments": "[]",
    "vat_id": 1,
    "family": "{\"id\": 15, \"name\": \"Umidificator\", \"family_type_id\": 4874}",
    "reversible_vat_charging": false,
    "min_sale_price": "1.0000",
    "max_sale_price": "100387.5800",
    "offer_details": "{\"id\": 43386768, \"warranty_type\": 1, \"supply_lead_time\": 14, \"emag_club\": 1}",
    "availability": "[{\"value\": 3}]",
    "stock": "[{\"value\": 48}]",
    "handling_time": "[{\"value\": 0}]",
    "ean": "[\"0760257270747\"]",
    "commission": null,
    "validation_status": "[{\"value\": 9, \"description\": \"Approved documentation\", \"errors\": null}]",
    "translation_validation_status": "[{\"value\": 9, \"description\": \"Approved documentation\", \"errors\": null}]",
    "offer_validation_status": "{\"value\": 1, \"description\": \"Saleable\", \"errors\": null}",
    "auto_translated": 0,
    "ownership": true,
    "best_offer_sale_price": "42.0100",
    "best_offer_recommended_price": "46.2110",
    "number_of_offers": 1,
    "genius_eligibility": 1,
    "recyclewarranties": 0,
    "id": 2,
    "units_sold": 8,
    "refunds": 2,
    "sales": 1992.09,
    "ads": 108.22,
    "sellable_return": 0,
    "gross_profit": 220.9,
    "net_profit": 220.9,
    "margin": 92,
    "roi": 510,
  },
  {
    "admin_user": "theinnovatorssrl@gmail.com",
    "part_number_key": "D8VY54MBM",
    "brand_name": "OEM",
    "buy_button_rank": null,
    "category_id": 3255,
    "brand": "Elindor",
    "name": "Marsupiu ergonomic cu gluga detasabila pentru bebe, buzunar de depozitare, suport lombar, pozitii orientate in spate sau rucsac pentru nou-nascuti si copii mici",
    "part_number": "6",
    "sale_price": "193.2700",
    "currency": "RON",
    "description": "<p>Marsupiul Cuddle Up este la fel de adorabil pe cat este de functional, cu <strong>gluga detasabila</strong> cu model ursulet si un <strong>buzunar practic</strong> pentru mainile parintilor.</p>\r\n\r\n<p><strong>Sezutul ergonomic si spatarul rotunjit</strong> natural ofera un suport sigur si confortabil pentru copil.</p>\r\n\r\n<p>Designul ergonomic sprijina spatele si soldurile bebelusului in <strong>pozitia</strong> &bdquo;<strong>M</strong>&rdquo;.</p>\r\n\r\n<p><strong>Caracteristici:</strong></p>\r\n\r\n<ul><li>Potrivit pentru bebelusi de la 5 kg pana la copii de 18 kg.</li>\r\n\t<li>Scaun confortabil, ergonomic pentru copil</li>\r\n\t<li>Designul ergonomic sprijina spatele si soldurile bebelusului in pozitia &bdquo;M&rdquo;.</li>\r\n\t<li>2 modalitati de transport: fata si rucsac</li>\r\n\t<li>Gluga ursulet detasabila</li>\r\n\t<li>Se poate curata la masina de spalat</li>\r\n</ul><p><strong><img alt=\"Unknown Image\" src=\"https://lh4.googleusercontent.com/K3p85s7jQ1vSr778w-fH5Vk3a9YTgB29zKrukr9_TuwIarkSFWC1oYmURz-V8etXIkOEt2VVfiOPwUFgeppxA0RwENAHagnFXLIVf6U_GIXvOBRSPezClQmYWt8RdST1pf-WNlLss_Gi2cl-jGGM0Qk\"></strong></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><strong><img alt=\"Unknown Image\" src=\"https://lh4.googleusercontent.com/fdeRIPER2aDFFDengE_CH5SZWEE9YozzUKUPAP5-NiYXoWD7js3ftH6-4IsGizOKyfJCW1iJxd4IVMFf6JZ8KuzVOxP6xKDIg7V-oywBFuV_3P4AiF-2RUmghr2VCk9mo-__MXDhueGvTLb7BZ1-_k0\"></strong></p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<p><strong><img alt=\"Unknown Image\" src=\"https://lh5.googleusercontent.com/9PJ-d4GijVckTL_18c2FK2kMUs9WfRhOFKOc7pfIcIyQDTbwKCgIZ5TrsSoDf67O6HCyV0R0bSjAJ8AJE0jZO-eS6url1u3VPs3WaejydlgEbDzce0L8lGAiZGD3cWFvNJEywpCRew5-e9k_dVq6Ycg\"></strong></p>\r\n\r\n<p><strong><img alt=\"Unknown Image\" src=\"https://lh6.googleusercontent.com/nCqMrdHgWpQprXm66zI8eruxxzgt613I3SQRXjppiTZDoZZd4wsra1HWjJcTvQZky1PxZl9VRHpaTVy7-GkMJrMcnpbikW6wv4UinAOHVQbGkYv-AYvmLxbRfU86hleRuenfDMJcr0ndXx-qLaQm4Ik\"></strong></p>\r\n\r\n<ul></ul>",
    "url": "",
    "warranty": 0,
    "general_stock": 0,
    "weight": "0.000000",
    "status": 1,
    "recommended_price": null,
    "images": "[{\"url\": \"https://marketplace-static.emag.ro/resources/000/039/228/604/39228604.png\", \"display_type\": 1}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/936/37599936.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/938/37599938.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/941/37599941.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/942/37599942.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/943/37599943.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/946/37599946.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/947/37599947.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/953/37599953.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/954/37599954.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/955/37599955.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/418/093/37418093.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/726/33637726.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/727/33637727.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/728/33637728.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/729/33637729.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/731/33637731.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/732/33637732.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/733/33637733.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/891/33582891.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/895/33582895.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/901/33582901.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/902/33582902.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/903/33582903.jpg\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/904/33582904.png\", \"display_type\": 2}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/905/33582905.png\", \"display_type\": 2}]",
    "attachments": "[]",
    "vat_id": 1,
    "family": "null",
    "reversible_vat_charging": false,
    "min_sale_price": "1.0000",
    "max_sale_price": "100387.5800",
    "offer_details": "{\"id\": 43386902, \"warranty_type\": 1, \"supply_lead_time\": 14, \"emag_club\": 0}",
    "availability": "[{\"value\": 5}]",
    "stock": "[{\"value\": 0}]",
    "handling_time": "[{\"value\": 0}]",
    "ean": "[\"0760257270785\"]",
    "commission": null,
    "validation_status": "[{\"value\": 9, \"description\": \"Approved documentation\", \"errors\": {\"status\": \"error\", \"request_id\": \"product-save_113532_6_1696498291_0\", \"doc_id\": 46953124, \"category_id\": null, \"part_number_key\": \"D8VY54MBM\", \"seller_input\": {\"request_id\": \"product-save_113532_6_1696498291_0\", \"doc_id\": 46953124, \"locale_code\": \"ro_RO\", \"platform_code\": \"emag-ro\", \"update_vendor_id\": 113532, \"ext_id\": 6, \"version\": 84, \"brand\": {\"eis_id\": 655277, \"name\": \"Elindor\"}, \"photo_gallery\": [{\"url\": \"https://marketplace-static.emag.ro/resources/000/039/228/604/39228604.png\", \"is_main\": true, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"d7c010c2-9ea7-4534-b85c-f921e52ab509\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/936/37599936.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"58d24743-430e-4517-adb9-40b76c1c4b50\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/938/37599938.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"8dd09622-5ee3-4f8a-81d9-127b02e5c0b5\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/941/37599941.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": true, \"resource_id\": \"9892c2ac-c30d-4546-a070-9759aa4079de\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/942/37599942.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"787c44a6-ddcf-4614-a1b7-7a52df5cea7f\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/943/37599943.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": true, \"resource_id\": \"f1e60805-600d-4d48-82e9-5cbdf01281f4\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/946/37599946.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"ffee136b-0aa3-4d1b-a7e2-f9161d59a331\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/947/37599947.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": true, \"resource_id\": \"770adca5-01b2-49d6-9a82-11f6190cf957\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/953/37599953.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"35c84c2d-d889-4013-a2ff-edad80282c23\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/954/37599954.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"e3c773e1-289d-4543-853e-d2595686d13d\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/955/37599955.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"0f6731f8-aff0-4241-b68c-45125995be66\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/418/093/37418093.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"e12fe500-b4b5-4f82-a219-29a3632c34f4\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/726/33637726.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"1c7b64d9-e656-4ee3-b831-2651c3e28463\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/729/33637729.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"2c3ab384-d770-4511-a9ba-fade9db5d560\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/731/33637731.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"aea74a8f-de54-48b9-9982-ffe48a74d166\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/891/33582891.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"02f02b0c-dc7f-46ba-97cf-5261c38c6a68\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/895/33582895.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"7e6aa8be-c3ba-4508-9b1a-184a72353725\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/901/33582901.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"838cda17-f469-428f-902c-f2797f9edc47\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/902/33582902.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"7e993597-214a-411f-8e5b-d3916d6b7536\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/903/33582903.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"1401fcf0-1be5-45db-a348-6cda0164d457\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/904/33582904.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"ec3f9371-79b7-4380-abcd-343d98568eff\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/905/33582905.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"786b1b29-6535-46f5-8356-624295594fc3\"}], \"characteristics\": [{\"id\": 4162, \"values\": [{\"value\": \"0-3 luni\"}]}, {\"id\": 6372, \"values\": [{\"value\": \"Poliester\"}]}, {\"id\": 7235, \"values\": [{\"value\": \"2 pozitii\"}]}, {\"id\": 5704, \"values\": [{\"value\": \"Ham\"}]}]}, \"errors\": [{\"code\": \"brand:incorrect-brand\", \"message\": {\"en_GB\": \"The completed brand is not valid. Please fill in the brand name as mentioned on the product packaging. It must represent the manufacturer or brand of the product.\", \"ro_RO\": \"Brandul completat nu este valid. Te rugam sa completezi numele brandului asa cum este mentionat pe ambalajul produsului. El trebuie sa reprezinte producatorul sau marca produsului.\", \"bg_BG\": \"\\u0417\\u0430\\u0432\\u044a\\u0440\\u0448\\u0435\\u043d\\u0430\\u0442\\u0430 \\u043c\\u0430\\u0440\\u043a\\u0430 \\u043d\\u0435 \\u0435 \\u0432\\u0430\\u043b\\u0438\\u0434\\u043d\\u0430. \\u041c\\u043e\\u043b\\u044f, \\u043f\\u043e\\u043f\\u044a\\u043b\\u043d\\u0435\\u0442\\u0435 \\u0438\\u043c\\u0435\\u0442\\u043e \\u043d\\u0430 \\u043c\\u0430\\u0440\\u043a\\u0430\\u0442\\u0430, \\u043a\\u0430\\u043a\\u0442\\u043e \\u0435 \\u043f\\u043e\\u0441\\u043e\\u0447\\u0435\\u043d\\u043e \\u0432\\u044a\\u0440\\u0445\\u0443 \\u043e\\u043f\\u0430\\u043a\\u043e\\u0432\\u043a\\u0430\\u0442\\u0430 \\u043d\\u0430 \\u043f\\u0440\\u043e\\u0434\\u0443\\u043a\\u0442\\u0430. \\u0422\\u043e\\u0439 \\u0442\\u0440\\u044f\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u043f\\u0440\\u0435\\u0434\\u0441\\u0442\\u0430\\u0432\\u043b\\u044f\\u0432\\u0430 \\u043f\\u0440\\u043e\\u0438\\u0437\\u0432\\u043e\\u0434\\u0438\\u0442\\u0435\\u043b\\u044f \\u0438\\u043b\\u0438 \\u043c\\u0430\\u0440\\u043a\\u0430\\u0442\\u0430 \\u043d\\u0430 \\u043f\\u0440\\u043e\\u0434\\u0443\\u043a\\u0442\\u0430.\", \"hu_HU\": \"A m\\u00e1rkan\\u00e9v nem \\u00e9rv\\u00e9nyes. K\\u00e9rj\\u00fck, t\\u00f6ltse ki a term\\u00e9k csomagol\\u00e1s\\u00e1n felt\\u00fcntetett m\\u00e1rkanevet. Ennek a term\\u00e9k gy\\u00e1rt\\u00f3j\\u00e1t vagy m\\u00e1rk\\u00e1j\\u00e1t kell jelentenie.\", \"pl_PL\": \"Wpisz prawid\\u0142ow\\u0105 mark\\u0119 lub nazw\\u0119 producenta produktu\"}, \"section\": \"brand\", \"extra_info\": null, \"identifier\": null}, {\"code\": \"requestedValue:suggestion\", \"message\": {\"en_GB\": \"For \\\"+0 luni\\\" of the characteristic \\\"Age:\\\" a more suitable option was identified and it was replaced with the value \\\"0-3 luni\\\".\", \"ro_RO\": \"Pentru valoarea \\\"+0 luni\\\" a caracteristicii \\\"Varsta:\\\" a fost identificata o optiune mai buna astfel ca aceasta a fost inlocuita cu valoarea \\\"0-3 luni\\\".\", \"bg_BG\": \"\\u0417\\u0430 \\\"+0 luni\\\" \\u043d\\u0430 \\u0445\\u0430\\u0440\\u0430\\u043a\\u0442\\u0435\\u0440\\u0438\\u0441\\u0442\\u0438\\u043a\\u0430\\u0442\\u0430 \\\"\\u0412\\u044a\\u0437\\u0440\\u0430\\u0441\\u0442:\\\" \\u0435 \\u0438\\u0434\\u0435\\u043d\\u0442\\u0438\\u0444\\u0438\\u0446\\u0438\\u0440\\u0430\\u043d\\u0430 \\u043f\\u043e-\\u043f\\u043e\\u0434\\u0445\\u043e\\u0434\\u044f\\u0449\\u0430 \\u043e\\u043f\\u0446\\u0438\\u044f \\u0438 \\u0435 \\u0437\\u0430\\u043c\\u0435\\u0441\\u0442\\u0435\\u043d\\u0430 \\u0441\\u044a\\u0441 \\u0441\\u0442\\u043e\\u0439\\u043d\\u043e\\u0441\\u0442 \\\"0-3 luni\\\".\", \"hu_HU\": \"Az  \\\"+0 luni\\\" Karakterisztik\\u00e1hoz az \\\"\\u00c9letkor:\\\" eset\\u00e9ben megfelel\\u0151bb lehet\\u0151s\\u00e9get tal\\u00e1ltak, \\u00e9s azt a \\\"0-3 luni\\\" \\u00e9rt\\u00e9kkel helyettes\\u00edtett\\u00e9k.\", \"pl_PL\": \"For \\\"+0 luni\\\" of the characteristic \\\"Wiek:\\\" a more suitable option was identified and it was replaced with the value \\\"0-3 luni\\\".\"}, \"section\": \"characteristics\", \"extra_info\": null, \"identifier\": \"0-3 luni\"}]}}]",
    "translation_validation_status": "[{\"value\": 9, \"description\": \"Approved documentation\", \"errors\": {\"status\": \"error\", \"request_id\": \"product-save_113532_6_1696498291_0\", \"doc_id\": 46953124, \"category_id\": null, \"part_number_key\": \"D8VY54MBM\", \"seller_input\": {\"request_id\": \"product-save_113532_6_1696498291_0\", \"doc_id\": 46953124, \"locale_code\": \"ro_RO\", \"platform_code\": \"emag-ro\", \"update_vendor_id\": 113532, \"ext_id\": 6, \"version\": 84, \"brand\": {\"eis_id\": 655277, \"name\": \"Elindor\"}, \"photo_gallery\": [{\"url\": \"https://marketplace-static.emag.ro/resources/000/039/228/604/39228604.png\", \"is_main\": true, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"d7c010c2-9ea7-4534-b85c-f921e52ab509\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/936/37599936.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"58d24743-430e-4517-adb9-40b76c1c4b50\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/938/37599938.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"8dd09622-5ee3-4f8a-81d9-127b02e5c0b5\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/941/37599941.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": true, \"resource_id\": \"9892c2ac-c30d-4546-a070-9759aa4079de\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/942/37599942.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"787c44a6-ddcf-4614-a1b7-7a52df5cea7f\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/943/37599943.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": true, \"resource_id\": \"f1e60805-600d-4d48-82e9-5cbdf01281f4\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/946/37599946.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"ffee136b-0aa3-4d1b-a7e2-f9161d59a331\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/947/37599947.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": true, \"resource_id\": \"770adca5-01b2-49d6-9a82-11f6190cf957\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/953/37599953.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"35c84c2d-d889-4013-a2ff-edad80282c23\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/954/37599954.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"e3c773e1-289d-4543-853e-d2595686d13d\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/599/955/37599955.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"0f6731f8-aff0-4241-b68c-45125995be66\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/037/418/093/37418093.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"e12fe500-b4b5-4f82-a219-29a3632c34f4\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/726/33637726.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"1c7b64d9-e656-4ee3-b831-2651c3e28463\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/729/33637729.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"2c3ab384-d770-4511-a9ba-fade9db5d560\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/637/731/33637731.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"aea74a8f-de54-48b9-9982-ffe48a74d166\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/891/33582891.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"02f02b0c-dc7f-46ba-97cf-5261c38c6a68\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/895/33582895.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"7e6aa8be-c3ba-4508-9b1a-184a72353725\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/901/33582901.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"838cda17-f469-428f-902c-f2797f9edc47\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/902/33582902.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"7e993597-214a-411f-8e5b-d3916d6b7536\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/903/33582903.jpg\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"1401fcf0-1be5-45db-a348-6cda0164d457\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/904/33582904.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"ec3f9371-79b7-4380-abcd-343d98568eff\"}, {\"url\": \"https://marketplace-static.emag.ro/resources/000/033/582/905/33582905.png\", \"is_main\": false, \"force_download\": false, \"has_identical_corresponding_image\": false, \"resource_id\": \"786b1b29-6535-46f5-8356-624295594fc3\"}], \"characteristics\": [{\"id\": 4162, \"values\": [{\"value\": \"0-3 luni\"}]}, {\"id\": 6372, \"values\": [{\"value\": \"Poliester\"}]}, {\"id\": 7235, \"values\": [{\"value\": \"2 pozitii\"}]}, {\"id\": 5704, \"values\": [{\"value\": \"Ham\"}]}]}, \"errors\": [{\"code\": \"brand:incorrect-brand\", \"message\": {\"en_GB\": \"The completed brand is not valid. Please fill in the brand name as mentioned on the product packaging. It must represent the manufacturer or brand of the product.\", \"ro_RO\": \"Brandul completat nu este valid. Te rugam sa completezi numele brandului asa cum este mentionat pe ambalajul produsului. El trebuie sa reprezinte producatorul sau marca produsului.\", \"bg_BG\": \"\\u0417\\u0430\\u0432\\u044a\\u0440\\u0448\\u0435\\u043d\\u0430\\u0442\\u0430 \\u043c\\u0430\\u0440\\u043a\\u0430 \\u043d\\u0435 \\u0435 \\u0432\\u0430\\u043b\\u0438\\u0434\\u043d\\u0430. \\u041c\\u043e\\u043b\\u044f, \\u043f\\u043e\\u043f\\u044a\\u043b\\u043d\\u0435\\u0442\\u0435 \\u0438\\u043c\\u0435\\u0442\\u043e \\u043d\\u0430 \\u043c\\u0430\\u0440\\u043a\\u0430\\u0442\\u0430, \\u043a\\u0430\\u043a\\u0442\\u043e \\u0435 \\u043f\\u043e\\u0441\\u043e\\u0447\\u0435\\u043d\\u043e \\u0432\\u044a\\u0440\\u0445\\u0443 \\u043e\\u043f\\u0430\\u043a\\u043e\\u0432\\u043a\\u0430\\u0442\\u0430 \\u043d\\u0430 \\u043f\\u0440\\u043e\\u0434\\u0443\\u043a\\u0442\\u0430. \\u0422\\u043e\\u0439 \\u0442\\u0440\\u044f\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u043f\\u0440\\u0435\\u0434\\u0441\\u0442\\u0430\\u0432\\u043b\\u044f\\u0432\\u0430 \\u043f\\u0440\\u043e\\u0438\\u0437\\u0432\\u043e\\u0434\\u0438\\u0442\\u0435\\u043b\\u044f \\u0438\\u043b\\u0438 \\u043c\\u0430\\u0440\\u043a\\u0430\\u0442\\u0430 \\u043d\\u0430 \\u043f\\u0440\\u043e\\u0434\\u0443\\u043a\\u0442\\u0430.\", \"hu_HU\": \"A m\\u00e1rkan\\u00e9v nem \\u00e9rv\\u00e9nyes. K\\u00e9rj\\u00fck, t\\u00f6ltse ki a term\\u00e9k csomagol\\u00e1s\\u00e1n felt\\u00fcntetett m\\u00e1rkanevet. Ennek a term\\u00e9k gy\\u00e1rt\\u00f3j\\u00e1t vagy m\\u00e1rk\\u00e1j\\u00e1t kell jelentenie.\", \"pl_PL\": \"Wpisz prawid\\u0142ow\\u0105 mark\\u0119 lub nazw\\u0119 producenta produktu\"}, \"section\": \"brand\", \"extra_info\": null, \"identifier\": null}, {\"code\": \"requestedValue:suggestion\", \"message\": {\"en_GB\": \"For \\\"+0 luni\\\" of the characteristic \\\"Age:\\\" a more suitable option was identified and it was replaced with the value \\\"0-3 luni\\\".\", \"ro_RO\": \"Pentru valoarea \\\"+0 luni\\\" a caracteristicii \\\"Varsta:\\\" a fost identificata o optiune mai buna astfel ca aceasta a fost inlocuita cu valoarea \\\"0-3 luni\\\".\", \"bg_BG\": \"\\u0417\\u0430 \\\"+0 luni\\\" \\u043d\\u0430 \\u0445\\u0430\\u0440\\u0430\\u043a\\u0442\\u0435\\u0440\\u0438\\u0441\\u0442\\u0438\\u043a\\u0430\\u0442\\u0430 \\\"\\u0412\\u044a\\u0437\\u0440\\u0430\\u0441\\u0442:\\\" \\u0435 \\u0438\\u0434\\u0435\\u043d\\u0442\\u0438\\u0444\\u0438\\u0446\\u0438\\u0440\\u0430\\u043d\\u0430 \\u043f\\u043e-\\u043f\\u043e\\u0434\\u0445\\u043e\\u0434\\u044f\\u0449\\u0430 \\u043e\\u043f\\u0446\\u0438\\u044f \\u0438 \\u0435 \\u0437\\u0430\\u043c\\u0435\\u0441\\u0442\\u0435\\u043d\\u0430 \\u0441\\u044a\\u0441 \\u0441\\u0442\\u043e\\u0439\\u043d\\u043e\\u0441\\u0442 \\\"0-3 luni\\\".\", \"hu_HU\": \"Az  \\\"+0 luni\\\" Karakterisztik\\u00e1hoz az \\\"\\u00c9letkor:\\\" eset\\u00e9ben megfelel\\u0151bb lehet\\u0151s\\u00e9get tal\\u00e1ltak, \\u00e9s azt a \\\"0-3 luni\\\" \\u00e9rt\\u00e9kkel helyettes\\u00edtett\\u00e9k.\", \"pl_PL\": \"For \\\"+0 luni\\\" of the characteristic \\\"Wiek:\\\" a more suitable option was identified and it was replaced with the value \\\"0-3 luni\\\".\"}, \"section\": \"characteristics\", \"extra_info\": null, \"identifier\": \"0-3 luni\"}]}}]",
    "offer_validation_status": "{\"value\": 1, \"description\": \"Saleable\", \"errors\": null}",
    "auto_translated": 0,
    "ownership": true,
    "best_offer_sale_price": "90.8300",
    "best_offer_recommended_price": "90.8300",
    "number_of_offers": 0,
    "genius_eligibility": 0,
    "recyclewarranties": 0,
    "id": 6,
    "units_sold": 8,
    "refunds": 2,
    "sales": 1992.09,
    "ads": 108.22,
    "sellable_return": 0,
    "gross_profit": 220.9,
    "net_profit": 220.9,
    "margin": 92,
    "roi": 510,
  }
]

const fakeSeries = [
  {
    name: 'Net Profit',
    type: 'bar',
    data: [40, 50, 65, 70, 50, 30],
  },
  {
    name: 'Revenue',
    type: 'bar',
    data: [20, 20, 25, 30, 30, 20],
  },
  {
    name: 'Expenses',
    type: 'area',
    data: [50, 80, 60, 90, 50, 70],
  },
  {
    name: 'Expenses',
    type: 'area',
    data: [50, 20, 10, 90, 50, 70],
  },
]

const fakeCategories = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

// const fakeStatistic = {
//   "Sales": [
//     {
//       "label": "Organic",
//       "value": "16056.22"
//     },{
//       "label": "Sponsored Products",
//       "value": "146.85"
//     }
//   ],
// }

// const fakeTrends = [
//   {
//     "product_id": ""
//   }
// ]

interface DashboardInfo {
  title: string;
  date: string;
  orders_units: string;
  sales: string;
  refunds: string;
  adv_cost: string;
  est_payout: string;
  gross_profit: string;
  net_profit: string;
}

interface Product {
  admin_user: string;
  part_number_key: string;
  brand_name: string;
  buy_button_rank?: number | null;
  category_id: number;
  brand: string;
  name: string;
  part_number: string;
  sale_price: string;
  currency: string;
  description?: string;
  url: string;
  warranty: number;
  general_stock: number;
  weight: string;
  status: number;
  recommended_price: number | null;
  images: string;
  attachments: string;
  vat_id: number;
  family: string;
  reversible_vat_charging: boolean;
  min_sale_price: string;
  max_sale_price: string;
  offer_details: string;
  availability: string;
  stock: string;
  handling_time: string;
  ean: string;
  commission: string | null;
  validation_status: string;
  translation_validation_status: string;
  offer_validation_status: string;
  auto_translated: number;
  ownership: boolean;
  best_offer_sale_price: string;
  best_offer_recommended_price: string;
  number_of_offers: number;
  genius_eligibility: number;
  recyclewarranties: number;
  id: number;
  units_sold: number;
  refunds: number;
  sales: number;
  ads: number;
  sellable_return: number;
  gross_profit: number;
  net_profit: number;
  margin: number;
  roi: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const TileComponent: FC<{
  dashboardinfo: DashboardInfo
}> = props => (
    <div className="card card-custom card-stretch shadow mb-5 cursor-pointer">
      <div className="card-header pt-4 pb-3">
        <div className='row'>
          <h3 className="text-gray-800 card-title">{props.dashboardinfo.title}</h3><br />
          <span className='text-gray-800 text text-light-gray-800'>{props.dashboardinfo.date}</span>
        </div>
      </div>
      <div className="card-body p-6">
        <div className='row mb-2'>
          <span className='text-gray-700'>Sales</span><br />
          <h2 className='text-gray-900 text-hover-primary'>
            {
              formatCurrency(parseFloat(props.dashboardinfo.sales))
            }
          </h2>
        </div>
        <div className='row mb-2'>
          <div className='col-md-6'>
            <span className='text-gray-700'>Orders / Units</span><br />
            <h4 className='text-gray-900 text-hover-primary'>
              {
                props.dashboardinfo.orders_units
              }
            </h4>
          </div>
          <div className='col-md-6'>
            <span className='text-gray-700'>Refunds</span><br />
            <h4 className='text-gray-900 text-hover-primary'>
              {
                props.dashboardinfo.refunds
              }
            </h4>
          </div>
        </div>
        <div className="separator my-4"></div>
        <div className='row mb-2'>
          <div className='col-md-6'>
            <span className='text-gray-700'>Adv. cost</span><br />
            <h4 className='text-gray-900 text-hover-primary'>
              {
                formatCurrency(parseFloat(props.dashboardinfo.adv_cost))
              }
            </h4>
          </div>
          <div className='col-md-6'>
            <span className='text-gray-700'>Est. payout</span><br />
            <h4 className='text-gray-900 text-hover-primary'>
              {
                formatCurrency(parseFloat(props.dashboardinfo.est_payout))
              }
            </h4>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <span className='text-gray-700'>Gross profit</span><br />
            <h4 className='text-gray-900 text-hover-primary'>
              {
                formatCurrency(parseFloat(props.dashboardinfo.gross_profit))
              }
            </h4>
          </div>
          <div className='col-md-6'>
            <span className='text-gray-700'>Net profit</span><br />
            <h4 className='text-gray-900 text-hover-primary'>
              {
                formatCurrency(parseFloat(props.dashboardinfo.net_profit))
              }
            </h4>
          </div>
        </div>
      </div>
      <div className="card-footer p-2 text-center">
        More
      </div>
    </div>
)

const TableProductsOrders: FC<{ products: Product[] }> = props => (
  <table className="table table-rounded table-row-bordered border gy-7 gs-7">
    <thead>
        <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
            <th className='col-md-8'>Products</th>
            <th className='text-end'>Units Sold</th>
            <th className='text-end'>Refunds</th>
            <th className='text-end'>Sales</th>
            <th className='text-end'>Ads</th>
            <th className='text-end'>Sellable Returns</th>
            <th className='text-end'>Gross Profit</th>
            <th className='text-end'>Net Profit</th>
            <th className='text-end'>Margin</th>
            <th className='text-end'>ROI</th>
            <th className='text-end'>Info</th>
        </tr>
    </thead>
    <tbody>
      {
        props.products.map((product, index) => 
          <tr key={index}>
            <td className='align-content-center p-2'>
              <div className='row'>
                <div className='col-1 align-content-center'>
                  {
                    JSON.parse(product.images).length > 0 ? <img width={60} height={60} src={JSON.parse(product.images)[0]["url"]} alt={product.name} />
                    : 
                    <div>
                      No Image
                    </div>
                  }
                </div>
                <div className='col-10'>
                  <span>{product.part_number_key}</span><br />
                  <span>{product.name}</span><br />
                  <span>{formatCurrency(parseFloat(product.sale_price))}</span>
                </div>
              </div>
            </td>
            <td className='text-end align-content-center'>
              {
                product.units_sold
              }
            </td>
            <td className='text-end align-content-center'>
              {
                product.refunds
              }
            </td>
            <td className='text-end align-content-center'>
              {
                formatCurrency(product.sales)
              }
            </td>
            <td className='text-end align-content-center'>
              {
                formatCurrency(product.ads)
              }
            </td>
            <td className='text-end align-content-center'>
              {
                product.sellable_return
              }%
            </td>
            <td className='text-end align-content-center'>
              {
                formatCurrency(product.gross_profit)
              }
            </td>
            <td className='text-end align-content-center'>
              {
                formatCurrency(product.net_profit)
              }
            </td>
            <td className='text-end align-content-center'>
              {
                product.margin
              }%
            </td>
            <td className='text-end align-content-center'>
              {
                product.roi
              }%
            </td>
            <td>

            </td>
          </tr>
        )
      }
    </tbody>
  </table>
)



const DashboardPage: FC = () => {
  const [dashboardinfos, setDashboardInfos] = useState<DashboardInfo[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // getDashboardInfo()
    //   .then(res => {
    //     if(res.msg != null && res.msg == "success"){
    //       console.log(res.data)
    //       setDashboardInfos(res.data);
    //     }
    //   })
    setDashboardInfos(fakeDashboard);
    setProducts(fakeProducts);
  }, [])

  return(
    <>
      <Content>
        <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6">
          <li className="nav-item">
            <a
              className="nav-link active"
              data-bs-toggle="tab"
              href="#dashboard-tiles"
            >
              <i className="bi bi-grid-fill"></i>
              &nbsp;Tiles
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              data-bs-toggle="tab"
              href="#dashboard-chart"
            >
              <i className="bi bi-bar-chart-fill"></i>
              &nbsp;Chart
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              data-bs-toggle="tab"
              href="#dashboard-pl"
            >
              <i className="bi bi-stack"></i>
              &nbsp;P&L
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              data-bs-toggle="tab"
              href="#dashboard-trends"
            >
              <i className="bi bi-rocket-takeoff-fill"></i>
              &nbsp;Trends
            </a>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="dashboard-tiles"
            role="tabpanel"
          >
            <div className='row d-flex'>
              {
                dashboardinfos.map((dashboardinfo, index) => 
                  <div className='custom-col-5' key={index}>
                    <TileComponent dashboardinfo={dashboardinfo} />
                  </div>
                )
              }
            </div>
            <div className='row'>
              <TableProductsOrders products={products} />
            </div>
          </div>
          <div className="tab-pane fade" id="dashboard-chart" role="tabpanel">
            <div className='row'>
              <div className='col-xl-9'>
                <ChartComponent className='card-xl-stretch mb-5 mb-xl-8' series={JSON.stringify(fakeSeries)} categories={JSON.stringify(fakeCategories)} />
              </div>
              <div className='col-xl-3'>

              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="dashboard-pl" role="tabpanel">
            PL
          </div>
          <div className="tab-pane fade" id="dashboard-trends" role="tabpanel">
            Trends
          </div>
        </div>
      </Content>
    </>
  )
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
