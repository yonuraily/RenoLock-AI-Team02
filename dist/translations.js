import {staffTranslations} from './staff-translations.js';
// Interface copy only. Stored user data and API enum values are never rewritten.
const rows=`
Демо-фото · пример интерьера|Демо фото · интерьер үлгісі|Demo photo · interior example
Открыть фото|Фотоны ашу|View photo
Фото:|Фото:|Photo:
Демонстрационный профиль. Фото интерьеров — примеры оформления, а не подтверждённые работы этой компании. Исходные отзывы — тестовые.|Демонстрациялық профиль. Интерьер фотолары — безендіру үлгілері, осы компанияның расталған жұмыстары емес. Бастапқы пікірлер — тестілік.|Demo profile. Interior photos are layout examples, not verified work by this company. Initial reviews are test examples.
Демо-фото · пример интерьера. Не подтверждённая работа компании.|Демо фото · интерьер үлгісі. Компанияның расталған жұмысы емес.|Demo photo · interior example. Not verified company work.
Фото и файлы|Фото және файлдар|Photos and files
До 3 файлов, до 5 МБ каждый. JPG, PNG, WebP, PDF, DOCX, XLSX, TXT, CSV.|3 файлға дейін, әрқайсысы 5 МБ дейін. JPG, PNG, WebP, PDF, DOCX, XLSX, TXT, CSV.|Up to 3 files, 5 MB each. JPG, PNG, WebP, PDF, DOCX, XLSX, TXT, CSV.
Не более 3 разных вложений|3 түрлі тіркемеден артық емес|No more than 3 different attachments
Файл должен быть от 1 байта до 5 МБ|Файл көлемі 1 байттан 5 МБ дейін болуы тиіс|File size must be between 1 byte and 5 MB
Добавьте сообщение или вложение|Хабарлама немесе тіркеме қосыңыз|Add a message or attachment
Загрузка файла|Файл жүктелуде|Uploading file
Вложение недоступно|Тіркеме қолжетімсіз|Attachment unavailable
Файл не найден|Файл табылмады|File not found
Не удалось загрузить файл|Файлды жүктеу мүмкін болмады|Could not upload file
Некорректное имя файла|Файл атауы дұрыс емес|Invalid filename
Содержимое не соответствует типу файла|Мазмұны файл түріне сәйкес емес|Content does not match the file type
Разрешены JPG, PNG, WebP, PDF, DOCX, XLSX, TXT и CSV|JPG, PNG, WebP, PDF, DOCX, XLSX, TXT және CSV рұқсат етіледі|Allowed: JPG, PNG, WebP, PDF, DOCX, XLSX, TXT and CSV
Недостаточно места в деморежиме. Попробуйте файл меньшего размера.|Демо режимінде орын жеткіліксіз. Кішірек файлды қолданып көріңіз.|Not enough demo storage. Try a smaller file.
Чат проекта|Жоба чаты|Project chat
Обсуждение ремонта|Жөндеуді талқылау|Renovation discussion
Переписка проекта|Жоба хат алмасуы|Project conversation
Ваше сообщение|Сіздің хабарламаңыз|Your message
Отправить сообщение|Хабарлама жіберу|Send message
Обновить чат|Чатты жаңарту|Refresh chat
Напишите о ремонте…|Жөндеу туралы жазыңыз…|Write about the renovation…
Новое сообщение в проекте|Жобада жаңа хабарлама|New project message
Сообщений пока нет. Обсудите ремонт с участником проекта.|Әзірге хабарламалар жоқ. Жөндеуді жоба қатысушысымен талқылаңыз.|No messages yet. Discuss the renovation with your project participant.
До 2000 символов. Новые сообщения проверяются каждые 20 секунд.|2000 таңбаға дейін. Жаңа хабарламалар әр 20 секунд сайын тексеріледі.|Up to 2000 characters. New messages are checked every 20 seconds.
Чат доступен только заказчику и подрядчику проекта|Чат тек жобаның тапсырыс берушісі мен мердігеріне қолжетімді|Chat is available only to the project's client and contractor
Проект завершён. Переписка доступна только для чтения|Жоба аяқталды. Хат алмасуды тек оқуға болады|Project completed. Conversation is read-only
Переписку видят только заказчик и подрядчик этого проекта. Сообщение не утверждает смету, перенос сроков или приёмку — используйте соответствующие действия.|Хат алмасуды тек осы жобаның тапсырыс берушісі мен мердігері көреді. Хабарлама сметаны, мерзім ауыстыруды немесе қабылдауды бекітпейді — тиісті әрекеттерді пайдаланыңыз.|Only this project's client and contractor can see the conversation. A message does not approve an estimate, date change or work acceptance — use the corresponding actions.
Уведомления|Хабарламалар|Notifications
Прочитать все|Барлығын оқу|Mark all read
Новое|Жаңа|New
Прочитано|Оқылды|Read
Открыть событие|Оқиғаны ашу|Open event
Уведомлений пока нет.|Әзірге хабарламалар жоқ.|No notifications yet.
События ваших заявок, проектов, сроков и приёмки.|Өтінімдер, жобалар, мерзімдер және қабылдау оқиғалары.|Updates on requests, projects, dates and acceptance.
Уведомления внутри платформы. При открытом кабинете проверяем новые события каждые 20 секунд. Email и push не подключены.|Хабарламалар платформа ішінде. Кабинет ашық кезде жаңа оқиғалар әр 20 секунд сайын тексеріледі. Email және push қосылмаған.|In-app notifications. New events are checked every 20 seconds while your workspace is open. Email and push are not connected.
Основные работы: сроки и приёмка|Негізгі жұмыстар: мерзімдер және қабылдау|Main works: dates and acceptance
Сроки и приёмка допработ|Қосымша жұмыстардың мерзімі және қабылдауы|Additional work dates and acceptance
Согласованные сроки|Келісілген мерзімдер|Agreed dates
Сроки ещё не согласованы|Мерзімдер әлі келісілмеген|Dates not agreed yet
Просрочка по согласованному сроку:|Келісілген мерзімнен кешігу:|Overdue against agreed date:
Календарные дни · время Казахстана (UTC+5)|Күнтізбелік күндер · Қазақстан уақыты (UTC+5)|Calendar days · Kazakhstan time (UTC+5)
Предложены новые даты|Жаңа күндер ұсынылды|New dates proposed
Текущие сроки действуют до решения заказчика.|Тапсырыс беруші шешіміне дейін бұрынғы мерзімдер күшінде.|Current dates remain effective until the client decides.
Согласовать даты|Күндерді келісу|Approve dates
Отклонить даты|Күндерді қабылдамау|Reject dates
Предложить перенос|Мерзімді ауыстыруды ұсыну|Propose date change
Предложить сроки|Мерзімдерді ұсыну|Propose dates
История сроков|Мерзімдер тарихы|Date history
Приёмка заказчиком|Тапсырыс берушінің қабылдауы|Client acceptance
Ход основных работ:|Негізгі жұмыстардың барысы:|Main work progress:
Начать / продолжить работы|Жұмысты бастау / жалғастыру|Start / resume work
Работы ещё не сданы на приёмку.|Жұмыстар әлі қабылдауға тапсырылмаған.|Work has not been submitted for acceptance.
Сдать работы на приёмку|Жұмысты қабылдауға тапсыру|Submit work for acceptance
Сдать повторно после исправлений|Түзетуден кейін қайта тапсыру|Resubmit after corrections
Принять работы|Жұмыстарды қабылдау|Accept work
Запросить исправления|Түзетулерді сұрау|Request corrections
Замечания заказчика:|Тапсырыс берушінің ескертулері:|Client remarks:
История приёмки|Қабылдау тарихы|Acceptance history
Ожидает приёмки|Қабылдауды күтуде|Awaiting acceptance
Нужны исправления|Түзетулер қажет|Corrections required
Принято заказчиком|Тапсырыс беруші қабылдады|Accepted by client
Приёмка фиксирует решение заказчика о результате работ. Она не подтверждает оплату и не меняет бюджет.|Қабылдау тапсырыс берушінің жұмыс нәтижесі туралы шешімін тіркейді. Ол төлемді растамайды және бюджетті өзгертпейді.|Acceptance records the client's decision on the work result. It does not confirm payment or change the budget.
Даты вступят в силу только после согласования заказчиком.|Күндер тапсырыс берушімен келісілгеннен кейін ғана күшіне енеді.|Dates take effect only after client approval.
Начало работ|Жұмыстың басталуы|Work start
Окончание работ|Жұмыстың аяқталуы|Work end
Обоснование сроков / переноса|Мерзімдер / ауыстыру себебі|Reason for dates / change
Причина отклонения|Қабылдамау себебі|Rejection reason
Эти даты станут согласованными сроками работ.|Бұл күндер келісілген жұмыс мерзімдері болады.|These dates will become the agreed work schedule.
Отчёт о выполнении|Орындалу есебі|Completion report
Что нужно исправить?|Нені түзету керек?|What needs correcting?
Подтвердить|Растау|Confirm
Подтвердите, что вы проверили результат этих работ и принимаете его. Это не подтверждение оплаты.|Жұмыс нәтижесін тексергеніңізді және қабылдағаныңызды растаңыз. Бұл төлем растамасы емес.|Confirm that you checked and accept this work result. This does not confirm payment.
Решение сохранено. Участники получат уведомление.|Шешім сақталды. Қатысушылар хабарлама алады.|Decision saved. Participants will receive an in-app notification.
Сначала примите основные работы проекта|Алдымен жобаның негізгі жұмыстарын қабылдаңыз|Accept the main project work first
Сначала примите все согласованные дополнительные работы|Алдымен барлық келісілген қосымша жұмыстарды қабылдаңыз|Accept all approved additional work first
Сначала согласуйте сроки работ|Алдымен жұмыс мерзімдерін келісіңіз|Agree work dates first
Сначала завершите согласование переноса сроков|Алдымен мерзім ауыстыруын келісуді аяқтаңыз|Resolve the pending date change first
Сроки уже изменены. Обновите данные.|Мерзімдер өзгертілген. Деректерді жаңартыңыз.|Dates have changed. Refresh the data.
Запрос приёмки уже изменён|Қабылдау сұрауы өзгертілген|The acceptance request has changed
Сроки предложены|Мерзімдер ұсынылды|Dates proposed
Сроки согласованы|Мерзімдер келісілді|Dates approved
Сроки отклонены|Мерзімдер қабылданбады|Dates rejected
Новые сроки на согласование|Келісуге жаңа мерзімдер|New dates for approval
Работы сданы на приёмку|Жұмыстар қабылдауға тапсырылды|Work submitted for acceptance
Работы готовы к приёмке|Жұмыстар қабылдауға дайын|Work ready for acceptance
Работы приняты|Жұмыстар қабылданды|Work accepted
Нужны исправления работ|Жұмыстарды түзету қажет|Work corrections requested
Новая заявка на ремонт|Жөндеуге жаңа өтінім|New renovation request
Получено предложение|Ұсыныс алынды|Proposal received
Предложение принято: проект создан|Ұсыныс қабылданды: жоба құрылды|Proposal accepted: project created
Заявка отклонена|Өтінім қабылданбады|Request declined
Вы добавлены в проект|Сіз жобаға қосылдыңыз|You were added to a project
Заказчик завершил проект|Тапсырыс беруші жобаны аяқтады|Client closed the project
Новая смета на согласование|Келісуге жаңа смета|New estimate for approval
Смета согласована|Смета келісілді|Estimate approved
Запрошены изменения сметы|Сметаға өзгерістер сұралды|Estimate changes requested
Обновлён ход работ|Жұмыс барысы жаңартылды|Work progress updated
Обновлён ход основных работ|Негізгі жұмыстар барысы жаңартылды|Main work progress updated
Выполнение согласованных работ|Келісілген жұмыстардың орындалуы|Approved work progress
Не начато|Басталмаған|Not started
В работе|Орындалуда|In progress
Задержано|Кешіктірілді|Delayed
Завершено|Аяқталды|Completed
Обновить выполнение|Орындалуды жаңарту|Update work progress
Статус выполнения|Орындалу күйі|Execution status
Задержка, дней|Кешігу, күн|Delay in days
Причина / комментарий|Себеп / түсініктеме|Reason / comment
Причина обязательна при задержке.|Кешігу кезінде себеп міндетті.|A reason is required for a delay.
История выполнения|Орындалу тарихы|Progress history
Изменений пока нет.|Әзірге өзгерістер жоқ.|No updates yet.
Сохранить выполнение|Орындалуды сақтау|Save progress
Статус выполнения сохранён|Орындалу күйі сақталды|Progress status saved
Статус сообщает подрядчик. Это не подтверждение приёмки или оплаты. Изменение хода работ не меняет согласованную сумму.|Күйді мердігер хабарлайды. Бұл қабылдау немесе төлем растамасы емес. Орындалуды өзгерту келісілген соманы өзгертпейді.|Status is reported by the contractor. It does not confirm acceptance or payment. Progress updates do not change the approved amount.
Обязательно только для статуса «Задержано». Это оценка подрядчика, не автоматический расчёт по календарю.|Тек «Кешіктірілді» күйінде міндетті. Бұл мердігердің бағалауы, күнтізбе бойынша автоматты есеп емес.|Required only for Delayed. This is the contractor's estimate, not an automatic calendar calculation.
Сметы по прайсу · Бесплатный локальный AI доступен на совместимых устройствах.|Прайс бойынша сметалар · Тегін жергілікті AI үйлесімді құрылғыларда қолжетімді.|Price-list estimates · Free local AI on compatible devices.
Мои финансы проекта|Жобадағы қаржым|My project finances
Только подрядчику|Тек мердігерге|Contractor only
Стоимость согласованных работ|Келісілген жұмыстардың құны|Approved work value
Суммы на согласовании не включены.|Келісуді күтетін сомалар қосылмаған.|Pending amounts are excluded.
Получено от заказчика|Тапсырыс берушіден алынды|Received from client
Осталось получить|Алуға қалды|Remaining receivable
План расходов на весь проект|Жобаның барлық шығындар жоспары|Total planned project costs
Плановая прибыль|Жоспарлы пайда|Estimated profit
Плановая маржа|Жоспарлы маржа|Estimated margin
Фактические расходы|Нақты шығындар|Actual costs
Остаток денежных средств|Ақша қалдығы|Cash balance
Обновить мои финансы|Қаржымды жаңарту|Update my finances
Сохранить мои финансы|Қаржымды сақтау|Save my finances
Мои финансы сохранены|Қаржылық деректер сақталды|My finances saved
Укажите план расходов|Шығындар жоспарын енгізіңіз|Enter planned costs
Не указан|Көрсетілмеген|Not entered
от стоимости договора|шарт құнынан|of contract value
Стоимость работ минус план расходов. Не гарантированный заработок; учтите все расходы и налоги.|Жұмыс құны минус жоспарлы шығындар. Бұл кепілді табыс емес; барлық шығындар мен салықтарды ескеріңіз.|Work value minus planned costs. Earnings are not guaranteed; include all costs and taxes.
Получено минус фактические расходы. Итоги вводятся вручную, подключения к банку нет.|Алынған ақша минус нақты шығындар. Қорытынды қолмен енгізіледі, банкке қосылмаған.|Receipts minus actual costs. Totals are entered manually; no bank connection.
Фактические расходы превысили план. Обновите прогноз.|Нақты шығындар жоспардан асты. Болжамды жаңартыңыз.|Actual costs exceed the plan. Update your forecast.
Получено больше стоимости договора. Проверьте аванс и внесённые суммы.|Шарт құнынан артық ақша алынды. Авансты және сомаларды тексеріңіз.|Receipts exceed contract value. Check advances and entered amounts.
Введите накопленные итоги по проекту. Сохранение заменяет прежние суммы, а не добавляет платёж. Эти данные видны только вам и не меняют бюджет заказчика.|Жобаның жинақталған қорытындысын енгізіңіз. Сақтау бұрынғы сомаларды ауыстырады, төлем қоспайды. Деректер тек сізге көрінеді және тапсырыс беруші бюджетін өзгертпейді.|Enter cumulative project totals. Saving replaces previous amounts; it does not add a payment. Only you can see these figures; the client budget is unchanged.
Бесплатный локальный AI|Тегін жергілікті AI|Free local AI
Загрузить бесплатную модель|Тегін модельді жүктеу|Download free model
Подготовить с AI|AI көмегімен дайындау|Prepare with AI
Загрузка бесплатной AI-модели|Тегін AI моделін жүктеу|Free AI model download
Начать загрузку|Жүктеуді бастау|Start download
Модель загружена|Модель жүктелді|Model loaded
Модель ещё не загружена. Режим правил доступен без загрузки.|Модель әлі жүктелмеді. Ережелер режимі жүктеусіз қолжетімді.|Model not loaded yet. Rules mode works without a download.
AI готов. Проверьте результат перед сохранением.|AI дайын. Сақтау алдында нәтижені тексеріңіз.|AI ready. Review the result before saving.
AI разбирает описание…|AI сипаттаманы талдауда…|AI is analysing the description…
AI-черновик готов. Обязательно проверьте работы и объёмы.|AI нобайы дайын. Жұмыстар мен көлемдерді тексеріңіз.|AI draft ready. Check all work items and quantities.
Qwen 0.5B работает на вашем устройстве через WebGPU. Первая загрузка — несколько сотен МБ; нужен совместимый Chrome/Edge и свободная память. Загрузка файлов идёт с CDN и Hugging Face. Текст сметы обрабатывается в браузере.|Qwen 0.5B WebGPU арқылы құрылғыңызда жұмыс істейді. Алғашқы жүктеу бірнеше жүз МБ; үйлесімді Chrome/Edge және бос жад қажет. Файлдар CDN және Hugging Face арқылы жүктеледі. Смета мәтіні браузерде өңделеді.|Qwen 0.5B runs on your device using WebGPU. Initial download is several hundred MB; compatible Chrome/Edge and available memory are required. Files download from CDN and Hugging Face. Estimate text is processed in your browser.
Модель может ошибаться. Цены берём только из прайса; результат — черновик для проверки.|Модель қателесуі мүмкін. Бағалар тек прайстан алынады; нәтиже тексеруге арналған нобай.|The model can make mistakes. Prices come only from your price list; the result is a draft for review.
Потребуется несколько сотен МБ трафика и память устройства. Модель загрузится с публичных CDN. Платного API нет.|Бірнеше жүз МБ трафик және құрылғы жады қажет. Модель ашық CDN арқылы жүктеледі. Ақылы API жоқ.|Requires several hundred MB of bandwidth and device memory. Model files download from public CDNs. No paid API.
Облачная платформа|Бұлттық платформа|Cloud platform
Ваш ремонт.|Сіздің жөндеуіңіз.|Your renovation.
Общее пространство.|Ортақ кеңістік.|One shared workspace.
Вход и регистрация|Кіру және тіркелу|Sign in and register
Завершите регистрацию|Тіркелуді аяқтаңыз|Complete registration
Войти через ChatGPT|ChatGPT арқылы кіру|Sign in with ChatGPT
Войдите через ChatGPT, затем выберите роль заказчика или подрядчика. Дополнительный пароль не нужен.|ChatGPT арқылы кіріп, тапсырыс беруші немесе мердігер рөлін таңдаңыз. Қосымша құпиясөз қажет емес.|Sign in with ChatGPT, then choose Client or Contractor. No additional password is needed.
Проекты, сметы и согласования сохраняются в облачной базе и доступны участникам с разных устройств.|Жобалар, сметалар және келісімдер бұлттық базада сақталып, қатысушыларға әртүрлі құрылғылардан қолжетімді.|Projects, estimates and approvals are saved in the cloud and available to participants across devices.
Выберите роль внимательно. Менеджеров назначает администратор.|Рөлді мұқият таңдаңыз. Менеджерлерді әкімші тағайындайды.|Choose your role carefully. Managers are appointed by an administrator.
Выйти из аккаунта|Аккаунттан шығу|Sign out
Попробовать без регистрации|Тіркелмей көру|Try without registering
Открыть деморежим|Демо режимін ашу|Open demo mode
Вернуться к облачному входу|Бұлттық кіруге оралу|Return to cloud sign in
Деморежим хранится отдельно в браузере и не изменяет реальные данные.|Демо режимі браузерде бөлек сақталады және нақты деректерді өзгертпейді.|Demo mode is stored separately in your browser and does not change real data.
Облако · D1|Бұлт · D1|Cloud · D1
RenoLock AI — бюджет под контролем|RenoLock AI — бюджет бақылауда|RenoLock AI — budget under control
Согласованные изменения|Келісілген өзгерістер|Approved changes
Добавьте прайс, опишите работу с явным объёмом для каждой позиции. Например: «Выровнять 20 м2 стен; грунтовка 20 м2».|Прайс қосып, әр позицияның көлемін нақты көрсетіңіз. Мысалы: «Қабырғаны тегістеу 20 м2; қабырғаны астарлау 20 м2».|Add a price list and specify the quantity for each work item. For example: “Wall leveling 20 m2; wall priming 20 m2”.
Генеративный AI API не подключён. Работает локальный алгоритм сопоставления по названию и ключевым словам. Он ищет позицию в действующем прайсе, извлекает явный объём и рассчитывает стоимость обычным кодом. Неизвестные работы и неоднозначные описания требуют ручного уточнения. Алгоритм не понимает свободную речь как языковая модель.|Генеративті AI API қосылмаған. Атаулар мен кілт сөздер бойынша сәйкестендіру алгоритмі жұмыс істейді. Ол ағымдағы прайстан позиция тауып, нақты көлемді анықтап, құнын код арқылы есептейді. Белгісіз жұмыстар мен екіұшты сипаттамалар қолмен нақтылауды қажет етеді. Алгоритм еркін сөйлеуді тілдік модель сияқты түсінбейді.|Generative AI is not connected. A local algorithm matches work names and keywords, finds current catalog entries, extracts explicit quantities and calculates costs. Unknown work and ambiguous descriptions need manual clarification. It does not understand free speech like a language model.
Голосовой ввод — необязательная функция браузера. Он доступен при поддержке Web Speech API и разрешении на микрофон. Распознавание может обрабатываться сервисом браузера, зависеть от интернета и не гарантируется. Всегда можно ввести текст вручную.|Дауыспен енгізу — браузердің қосымша мүмкіндігі. Ол Web Speech API қолдауы және микрофон рұқсаты болғанда қолжетімді. Тануды браузер қызметі өңдеуі мүмкін, интернетке тәуелді және кепілдендірілмейді. Мәтінді әрқашан қолмен енгізуге болады.|Voice input is an optional browser feature requiring Web Speech API support and microphone permission. Recognition may use the browser provider’s service and the internet, and availability is not guaranteed. Text entry always remains available.
Серверная версия использует защищённую cookie-сессию и SQLite. Клиент видит только назначенные ему проекты. Для двух ролей войдите в разных браузерах или в приватном окне.|Сервер нұсқасы қорғалған cookie сессиясы мен SQLite пайдаланады. Клиент тек өзіне тағайындалған жобаларды көреді. Екі рөл үшін әртүрлі браузерде немесе жеке терезеде кіріңіз.|The server version uses a protected cookie session and SQLite. Clients only see assigned projects. Use different browsers or a private window for two roles.
Онлайн-демо использует localStorage и переключение тестовых ролей. Данные не синхронизируются между устройствами. Это песочница для показа интерфейса, а не защищённое многопользовательское хранилище.|Онлайн демо localStorage және тест рөлдерін ауыстыруды қолданады. Деректер құрылғылар арасында синхрондалмайды. Бұл интерфейсті көрсетуге арналған демо орта, қорғалған көппайдаланушы қоймасы емес.|The online demo uses localStorage and test role switching. Data does not sync across devices. This is an interface sandbox, not protected shared storage.
Для демонстрации: откройте смету «Подготовка стен в гостиной» как заказчик, утвердите 58 000 ₸. Бюджет ЖК Nova изменится с 2 421 000 ₸ до 2 479 000 ₸.|Демо үшін тапсырыс беруші ретінде «Подготовка стен в гостиной» сметасын ашып, 58 000 ₸ бекітіңіз. Nova ТК бюджеті 2 421 000 ₸-ден 2 479 000 ₸-ге өзгереді.|For a demo, open “Подготовка стен в гостиной” as the client and approve 58,000 ₸. The Nova project budget changes from 2,421,000 ₸ to 2,479,000 ₸.
UTF-8, разделитель «;». Первая строка: name;unit;price;aliases. Единицы: м², м, шт. Импорт добавляет новые позиции.|UTF-8, бөлгіш «;». Бірінші жол: name;unit;price;aliases. Бірліктер: м², м, шт. Импорт жаңа позициялар қосады.|UTF-8, semicolon separator. Header: name;unit;price;aliases. Use these stored unit codes: м², м, шт. Import adds new items.
Выровнять 20 м2 стен; грунтовка 20 м2|Қабырғаны тегістеу 20 м2; қабырғаны астарлау 20 м2|Wall leveling 20 m2; wall priming 20 m2
Выровнять стены 20 м² и нанести грунтовку…|Қабырғаны тегістеу 20 м²; қабырғаны астарлау 20 м²…|Wall leveling 20 m2; wall priming 20 m2…
Укажите один объём и единицу: например, 20|Бір көлем мен бірлікті көрсетіңіз: мысалы, 20|Specify one quantity and unit, for example 20
Не удалось распознать речь|Сөйлеуді тану мүмкін болмады|Could not recognize speech
Используйте текстовый ввод.|Мәтінмен енгізуді қолданыңыз.|Use text input.
Прайс-лист доступен только подрядчику.|Бағалар тізімі тек мердігерге қолжетімді.|The price list is available to contractors only.
Удалить|Жою|Remove
бюджет под контролем|бюджет бақылауда|budget under control
`;
const mainRows=`
Рабочее пространство|Жұмыс кеңістігі|Workspace
РАБОЧЕЕ ПРОСТРАНСТВО|ЖҰМЫС КЕҢІСТІГІ|WORKSPACE
Порядок в каждом изменении|Әр өзгеріс бақылауда|Every change under control
Ваше рабочее пространство|Сіздің жұмыс кеңістігіңіз|Your workspace
Ремонт меняется.|Жөндеу өзгереді.|Renovation changes.
Доверие остаётся.|Сенім сақталады.|Trust stays.
От первой сметы до последних деталей — согласовывайте работы и держите бюджет под контролем.|Алғашқы сметадан соңғы бөлшектерге дейін — жұмыстарды келісіп, бюджетті бақылаңыз.|From the first estimate to the finishing touches, agree on work and keep the budget under control.
Прозрачный бюджет. Спокойный ремонт.|Ашық бюджет. Алаңсыз жөндеу.|Clear budget. Peace of mind.
С возвращением|Қайта оралуыңызбен|Welcome back
Создать аккаунт|Тіркелгі ашу|Create an account
Начните с роли в вашем проекте.|Жобадағы рөліңізді таңдаудан бастаңыз.|Start by choosing your role in the project.
Войдите, чтобы продолжить работу над проектами.|Жобалармен жұмысты жалғастыру үшін кіріңіз.|Sign in to continue working on your projects.
Онлайн-песочница: данные сохраняются в этом браузере. Для демонстрации выберите роль ниже. Регистрация и защищённые аккаунты доступны в локальной серверной версии.|Онлайн демо: деректер осы браузерде сақталады. Төменнен рөлді таңдаңыз. Тіркелу мен қорғалған тіркелгілер жергілікті сервер нұсқасында қолжетімді.|Online sandbox: data stays in this browser. Choose a demo role below. Registration and protected accounts are available in the local server version.
Ваше имя|Атыңыз|Your name
Имя и фамилия|Аты-жөні|Full name
Пароль|Құпиясөз|Password
Не менее 10 символов|Кемінде 10 таңба|At least 10 characters
Ваша роль|Сіздің рөліңіз|Your role
Contractor — подрядчик|Contractor — мердігер|Contractor
Client — заказчик|Client — тапсырыс беруші|Client
Зарегистрироваться|Тіркелу|Sign up
Войти в аккаунт|Тіркелгіге кіру|Sign in
Уже есть аккаунт?|Тіркелгіңіз бар ма?|Already have an account?
Первый раз в RenoLock?|RenoLock-та алғаш ретсіз бе?|New to RenoLock?
Войти|Кіру|Sign in
Попробовать на тестовых данных|Тест деректерімен көру|Try with sample data
Подрядчик|Мердігер|Contractor
Заказчик|Тапсырыс беруші|Client
Бесплатно · Без ключа API · Валюта KZT|Тегін · API кілтінсіз · Валюта KZT|Free · No API key · Currency KZT
Сметы по правилам и прайсу — генеративный AI не подключён.|Сметалар ережелер мен прайсқа негізделеді — генеративті AI қосылмаған.|Estimates use rules and your price list. Generative AI is not connected.
Панель подрядчика|Мердігер кабинеті|Contractor workspace
Панель заказчика|Тапсырыс беруші кабинеті|Client workspace
Личный кабинет|Жеке кабинет|My workspace
Найти исполнителя|Орындаушыны табу|Find a professional
Заявки и предложения|Өтінімдер мен ұсыныстар|Requests and proposals
Мой профиль|Менің профилім|My profile
Обзор|Шолу|Overview
Мои проекты|Менің жобаларым|My projects
Сметы и согласования|Сметалар мен келісімдер|Estimates and approvals
Прайс-лист|Бағалар тізімі|Price list
Журнал решений|Шешімдер журналы|Decision history
Как это работает|Бұл қалай жұмыс істейді|How it works
Бюджет под защитой|Бюджет қорғалған|Your budget is protected
Никаких неожиданных расходов. Каждое изменение — с вашим решением.|Күтпеген шығындарсыз. Әр өзгеріс сіздің шешіміңізбен.|No unexpected expenses. You decide on every change.
Выйти|Шығу|Sign out
Сервер · SQLite|Сервер · SQLite|Server · SQLite
Демо · в этом браузере|Демо · осы браузерде|Demo · in this browser
Обновить данные|Деректерді жаңарту|Refresh data
Открыть меню|Мәзірді ашу|Open menu
Демонстрационная песочница · Данные только в этом браузере · Для реальных аккаунтов и совместной работы запустите серверную версию из исходников.|Демо орта · Деректер тек осы браузерде · Нақты тіркелгілер және бірлескен жұмыс үшін сервер нұсқасын іске қосыңыз.|Demo sandbox · Data stays in this browser · Run the server version for real accounts and shared work.
Контроль бюджета ремонта|Жөндеу бюджетін бақылау|Renovation budget control
Цены из прайса · AI API не подключён|Бағалар прайстан · AI API қосылмаған|Prices from your catalog · AI API not connected
Всё под контролем|Барлығы бақылауда|Everything under control
Проекты, сметы и решения — в одном рабочем пространстве.|Жобалар, сметалар мен шешімдер — бір жұмыс кеңістігінде.|Projects, estimates and decisions in one workspace.
Обзор проектов|Жобаларға шолу|Project overview
Новый проект|Жаңа жоба|New project
Новая смета|Жаңа смета|New estimate
Активные проекты|Белсенді жобалар|Active projects
Все ваши ремонтные проекты|Барлық жөндеу жобаларыңыз|All your renovation projects
Утверждённый бюджет|Бекітілген бюджет|Approved budget
Базовая смета + согласованные работы|Бастапқы смета + келісілген жұмыстар|Initial estimate + approved work
На согласовании|Келісілуде|Awaiting approval
ожидает решения|шешімді күтуде|awaiting a decision
Согласовано дополнительно|Қосымша келісілді|Approved additions
смета утверждена|смета бекітілді|estimate approved
смет согласовано|смета келісілді|estimates approved
Ваши проекты|Сіздің жобаларыңыз|Your projects
Все проекты|Барлық жобалар|All projects
Ожидает согласования|Келісімді күтуде|Awaiting approval
В работе|Орындалуда|In progress
Текущий бюджет|Ағымдағы бюджет|Current budget
Базовая смета|Бастапқы смета|Initial estimate
смета на согласовании|смета келісуді күтуде|estimate awaiting approval
Открыть|Ашу|Open
Ассистент смет|Смета көмекшісі|Estimate assistant
Опишите работу.|Жұмысты сипаттаңыз.|Describe the work.
Получите черновик.|Жобасын алыңыз.|Get a draft.
Сопоставим работы с вашим прайсом. Вы проверите детали перед отправкой.|Жұмыстарды прайсыңызбен сәйкестендіреміз. Жібермес бұрын мәліметтерді тексересіз.|We match work with your price list. You review the details before sending.
Подготовить смету|Смета дайындау|Prepare an estimate
Посмотреть сметы|Сметаларды көру|View estimates
Режим правил · Без AI API и выдуманных цен|Ережелер режимі · AI API және ойдан шығарылған бағаларсыз|Rules mode · No AI API or invented prices
Последние сметы|Соңғы сметалар|Recent estimates
Все сметы|Барлық сметалар|All estimates
Последние события|Соңғы оқиғалар|Recent activity
От первоначальной сметы до согласованного бюджета.|Алғашқы сметадан келісілген бюджетке дейін.|From the initial estimate to an approved budget.
Поиск по проектам…|Жобаларды іздеу…|Search projects…
проекта|жоба|projects
Проекты не найдены.|Жобалар табылмады.|No projects found.
Все дополнительные работы и статус каждого решения.|Барлық қосымша жұмыстар және әр шешімнің күйі.|All additional work and the status of each decision.
Черновик|Жоба нұсқасы|Draft
Согласовано|Келісілді|Approved
Отклонено|Қабылданбады|Rejected
Нужны изменения|Өзгерістер қажет|Changes requested
Смета / проект|Смета / жоба|Estimate / project
Статус|Күйі|Status
Сумма|Сома|Amount
Смет пока нет. Начните с нового проекта или создайте дополнительную смету.|Сметалар әлі жоқ. Жаңа жобадан бастаңыз немесе қосымша смета жасаңыз.|No estimates yet. Start a project or create an additional estimate.
Создайте свой первый ремонтный проект.|Алғашқы жөндеу жобаңызды жасаңыз.|Create your first renovation project.
Здесь появится история ваших решений.|Шешімдеріңіздің тарихы осында көрсетіледі.|Your decision history will appear here.
Черновик обновлён|Жоба нұсқасы жаңартылды|Draft updated
Создан проект|Жоба жасалды|Project created
Бюджет проекта|Жоба бюджеті|Project budget
Утверждено к оплате|Төлемге бекітілді|Approved amount
Первоначальная смета|Алғашқы смета|Initial estimate
Дополнительные работы|Қосымша жұмыстар|Additional work
На согласовании:|Келісілуде:|Awaiting approval:
Эта сумма ещё не включена в бюджет. Это план согласованных расходов, не учёт фактических платежей.|Бұл сома бюджетке әлі қосылмаған. Бұл келісілген шығындар жоспары, нақты төлемдер есебі емес.|This amount is not included in the budget yet. This is an agreed cost plan, not a record of actual payments.
Наименование|Атауы|Item
Объём|Көлемі|Quantity
Цена / ед.|Бірлік бағасы|Unit price
Изменение цены:|Баға өзгерісі:|Price adjustment:
По прайсу:|Прайс бойынша:|Catalog price:
Итого|Барлығы|Total
Проект не найден.|Жоба табылмады.|Project not found.
Назад к проекту|Жобаға оралу|Back to project
К проекту|Жобаға өту|View project
Печать / PDF|Басып шығару / PDF|Print / PDF
Отчёт|Есеп|Report
Финансовый отчёт|Қаржылық есеп|Financial report
Ремонтный проект|Жөндеу жобасы|Renovation project
Заказчик:|Тапсырыс беруші:|Client:
Подрядчик:|Мердігер:|Contractor:
Отчёт сформирован:|Есеп жасалды:|Report generated:
Валюта KZT. Статусы и суммы приведены на момент формирования.|Валюта KZT. Күйлер мен сомалар есеп жасалған сәтке сәйкес.|Currency KZT. Statuses and amounts are shown as of report generation.
Зафиксирована|Бекітілген|Fixed
смет|смета|estimates
События проекта|Жоба оқиғалары|Project activity
История решений и версий|Шешімдер мен нұсқалар тарихы|Decision and version history
Для сохранения выберите «Печать / PDF», затем «Сохранить как PDF» в диалоге браузера. Отчёт включает базовую смету, все видимые дополнительные сметы и историю решений.|Сақтау үшін «Басып шығару / PDF», содан кейін браузер терезесінде «PDF ретінде сақтау» таңдаңыз. Есеп бастапқы сметаны, көрінетін қосымша сметаларды және шешімдер тарихын қамтиды.|Choose Print / PDF, then Save as PDF in the browser dialog. The report includes the initial estimate, all visible additional estimates and decision history.
Кто, когда и какую версию сметы согласовал.|Сметаның қай нұсқасын кім және қашан келіскені.|Who approved which estimate version and when.
Состав сметы на момент события|Оқиға кезіндегі смета құрамы|Estimate snapshot at the time of this event
Решений пока нет.|Шешімдер әлі жоқ.|No decisions yet.
Смета недоступна.|Смета қолжетімсіз.|Estimate unavailable.
Редактировать|Өңдеу|Edit
Версия|Нұсқа|Version
1. Подготовка|1. Дайындау|1. Preparation
2. Согласование|2. Келісу|2. Approval
3. Обновление бюджета|3. Бюджетті жаңарту|3. Budget update
Смета дополнительных работ|Қосымша жұмыстар сметасы|Additional work estimate
Описание работ|Жұмыстар сипаттамасы|Work description
Перед отправкой проверьте объёмы, цены и состав работ. После отправки смета будет заблокирована для редактирования до решения клиента.|Жібермес бұрын көлемдерді, бағаларды және жұмыс құрамын тексеріңіз. Жіберілген смета клиенттің шешіміне дейін өңдеуге жабылады.|Review quantities, prices and scope before sending. Editing is locked until the client makes a decision.
Отправить заказчику|Тапсырыс берушіге жіберу|Send to client
Комментарий к решению|Шешімге түсініктеме|Decision comment
Обязателен при отклонении или запросе изменений|Қабылдамағанда немесе өзгерістер сұрағанда міндетті|Required when rejecting or requesting changes
Утвердить смету|Сметаны бекіту|Approve estimate
Запросить изменения|Өзгерістер сұрау|Request changes
Отклонить|Қабылдамау|Reject
Смета утверждена. Сумма включена в бюджет проекта.|Смета бекітілді. Сома жоба бюджетіне қосылды.|Estimate approved. The amount is included in the project budget.
Ожидаем решения заказчика. Сумма пока не включена в бюджет.|Тапсырыс берушінің шешімін күтудеміз. Сома бюджетке әлі қосылмаған.|Waiting for the client’s decision. The amount is not included in the budget yet.
Смета отклонена. Бюджет проекта не изменился.|Смета қабылданбады. Жоба бюджеті өзгерген жоқ.|Estimate rejected. The project budget is unchanged.
Заказчик запросил изменения. Подрядчик может отредактировать и отправить смету повторно.|Тапсырыс беруші өзгерістер сұрады. Мердігер сметаны өңдеп, қайта жібере алады.|The client requested changes. The contractor can edit and resubmit the estimate.
История этой сметы|Осы сметаның тарихы|Estimate history
Утверждённые и отклонённые сметы сохраняются без изменений. Прайс-лист не меняет ранее согласованные суммы.|Бекітілген және қабылданбаған сметалар өзгеріссіз сақталады. Прайс бұрын келісілген сомаларды өзгертпейді.|Approved and rejected estimates are preserved. Price list changes do not alter previously approved amounts.
Ваши цены — единственный источник стоимости для новых смет.|Сіздің бағаларыңыз — жаңа сметалар құнының жалғыз көзі.|Your prices are the only cost source for new estimates.
Импорт CSV|CSV импорттау|Import CSV
Добавить работу|Жұмыс қосу|Add work item
Ассистент использует названия и ключевые слова из вашего прайса. Новая цена применяется при сохранении черновика. Отправленные и согласованные сметы хранят снимок цены.|Көмекші прайсыңыздағы атаулар мен кілт сөздерді қолданады. Жаңа баға жоба нұсқасын сақтағанда қолданылады. Жіберілген және келісілген сметалардағы бағалар сақталады.|The assistant uses names and keywords from your price list. New prices apply when saving a draft. Submitted and approved estimates retain a price snapshot.
Работы и расценки|Жұмыстар мен бағалар|Work items and rates
активных позиций|белсенді позиция|active items
Наименование работы|Жұмыс атауы|Work item name
Единица|Өлшем бірлігі|Unit
Цена|Баға|Price
Активна|Белсенді|Active
В архиве|Мұрағатта|Archived
Добавьте первую работу или импортируйте прайс.|Алғашқы жұмысты қосыңыз немесе прайсты импорттаңыз.|Add your first work item or import a price list.
Редактирование сметы|Сметаны өңдеу|Edit estimate
Опишите работы, проверьте позиции и сохраните черновик.|Жұмыстарды сипаттап, позицияларды тексеріп, жоба нұсқасын сақтаңыз.|Describe the work, review line items and save a draft.
Откройте создание сметы из проекта.|Смета жасауды жоба ішінен ашыңыз.|Open estimate creation from a project.
Описание дополнительных работ|Қосымша жұмыстар сипаттамасы|Additional work description
Проект|Жоба|Project
Название сметы|Смета атауы|Estimate title
Например, подготовка стен в гостиной|Мысалы, қонақ бөлме қабырғаларын дайындау|For example, living room wall preparation
Что нужно сделать?|Не істеу керек?|What needs to be done?
Укажите объём каждой работы отдельно. Цена подставится из вашего прайса.|Әр жұмыстың көлемін бөлек көрсетіңіз. Баға прайсыңыздан алынады.|Specify the quantity for each work item separately. Prices come from your catalog.
Подготовить по прайсу|Прайс бойынша дайындау|Prepare from price list
Голосовой ввод|Дауыспен енгізу|Voice input
Пример|Мысал|Example
Режим правил · AI API не подключён. Ассистент не придумывает цены и не отправляет сметы без вашего участия.|Ережелер режимі · AI API қосылмаған. Көмекші бағаны ойдан шығармайды және сметаларды сізсіз жібермейді.|Rules mode · AI API is not connected. The assistant does not invent prices or send estimates without you.
Состав сметы|Смета құрамы|Estimate line items
Работа из прайса|Прайстағы жұмыс|Catalog work item
Цена / ед., ₸|Бірлік бағасы, ₸|Unit price, ₸
Добавить позицию вручную|Позицияны қолмен қосу|Add an item manually
Итого по черновику|Жоба нұсқасының сомасы|Draft total
Цена, отличающаяся от действующего прайса, требует пояснения. Проверьте все работы и объёмы перед сохранением.|Ағымдағы прайстан өзгеше баға түсініктемені қажет етеді. Сақтамас бұрын барлық жұмыс пен көлемді тексеріңіз.|A price that differs from the current catalog requires an explanation. Review all work and quantities before saving.
Сохранить черновик|Жоба нұсқасын сақтау|Save draft
Сначала проверка|Алдымен тексеру|Review first
Черновик виден только подрядчику. После сохранения его можно проверить ещё раз и отправить заказчику отдельным действием.|Жоба нұсқасын тек мердігер көреді. Сақтағаннан кейін қайта тексеріп, тапсырыс берушіге бөлек әрекетпен жіберуге болады.|Only the contractor can see the draft. After saving, review it again and send it to the client as a separate action.
Голосовой ввод недоступен в этом браузере. Используйте текст.|Бұл браузерде дауыспен енгізу қолжетімсіз. Мәтінді қолданыңыз.|Voice input is unavailable in this browser. Use text instead.
Браузер не поддерживает голосовой ввод|Браузер дауыспен енгізуді қолдамайды|This browser does not support voice input
Пояснение изменения цены (если отличается от прайса)|Баға өзгерісінің себебі (прайстан өзгеше болса)|Reason for price change (if different from catalog)
Например, сложная геометрия стены|Мысалы, қабырғаның күрделі пішіні|For example, complex wall geometry
Позиции появятся после подготовки сметы.|Смета дайындалған соң позициялар пайда болады.|Items will appear after preparing the estimate.
Нужно уточнить — не включено в смету:|Нақтылау қажет — сметаға қосылмаған:|Clarification needed — not included in estimate:
Уточните описание и подготовьте заново либо добавьте нужную позицию вручную из прайса.|Сипаттаманы нақтылап қайта дайындаңыз немесе прайстан қажетті позицияны қолмен қосыңыз.|Clarify the description and prepare again, or add the required catalog item manually.
Я проверил и обработал эти замечания|Ескертулерді тексеріп, өңдедім|I have reviewed and addressed these items
Закрыть|Жабу|Close
Новый ремонтный проект|Жаңа жөндеу жобасы|New renovation project
Название проекта|Жоба атауы|Project name
Площадь, м²|Ауданы, м²|Area, m²
Адрес|Мекенжай|Address
Город, улица, дом|Қала, көше, үй|City, street, building
Email зарегистрированного заказчика|Тіркелген тапсырыс берушінің email мекенжайы|Registered client email
Заказчик должен зарегистрироваться как Client. Демо: client@renolock.demo|Тапсырыс беруші Client ретінде тіркелуі керек. Демо: client@renolock.demo|The client must register as Client. Demo: client@renolock.demo
После создания проекта базовая смета фиксируется. Изменения оформляются отдельными сметами.|Жоба жасалғанда бастапқы смета бекітіледі. Өзгерістер бөлек сметалармен рәсімделеді.|The initial estimate is fixed when creating a project. Changes are recorded as separate estimates.
Работа|Жұмыс|Work item
Ед.|Бірл.|Unit
Начальный бюджет|Бастапқы бюджет|Initial budget
Отмена|Бас тарту|Cancel
Создать проект|Жоба жасау|Create project
Ремонт по договору|Шарт бойынша жөндеу|Renovation under contract
Удалить строку|Жолды жою|Remove row
Редактировать расценку|Бағаны өңдеу|Edit rate
Название работы|Жұмыс атауы|Work item name
Единица измерения|Өлшем бірлігі|Unit of measure
Цена за единицу, ₸|Бірлік бағасы, ₸|Price per unit, ₸
Ключевые слова через запятую|Үтірмен бөлінген кілт сөздер|Keywords separated by commas
Используются для поиска работы в тексте. Не добавляйте слишком общие слова.|Мәтіннен жұмысты табуға қолданылады. Тым жалпы сөздерді қоспаңыз.|Used to find work items in text. Avoid overly broad keywords.
Сохранить|Сақтау|Save
Импорт прайс-листа CSV|Бағалар тізімін CSV арқылы импорттау|Import price list CSV
CSV файл|CSV файлы|CSV file
Импортировать|Импорттау|Import
Подтвердить|Растау|Confirm
Утвердить дополнительные работы?|Қосымша жұмыстарды бекітесіз бе?|Approve additional work?
Дополнительная сумма|Қосымша сома|Additional amount
Новый бюджет проекта|Жобаның жаңа бюджеті|New project budget
Решение сохранится в журнале. Утверждённую смету нельзя редактировать.|Шешім журналда сақталады. Бекітілген сметаны өңдеуге болмайды.|The decision will be recorded. An approved estimate cannot be edited.
Заменить позиции черновика?|Жоба нұсқасының позицияларын ауыстырасыз ба?|Replace draft items?
Повторная подготовка заменит текущие позиции результатом разбора описания. Название и описание сохранятся.|Қайта дайындау ағымдағы позицияларды сипаттама нәтижесімен ауыстырады. Атауы мен сипаттамасы сақталады.|Preparing again will replace current items with the description results. The title and description will be kept.
Заменить позиции|Позицияларды ауыстыру|Replace items
Сбросить песочницу?|Демо ортаны қалпына келтіресіз бе?|Reset sandbox?
Все изменения в онлайн-демо будут заменены исходными тестовыми данными.|Онлайн демодағы барлық өзгеріс бастапқы тест деректерімен ауыстырылады.|All online demo changes will be replaced with the original sample data.
Сбросить|Қалпына келтіру|Reset
Сбросить тестовые данные|Тест деректерін қалпына келтіру|Reset sample data
Остановить запись|Жазуды тоқтату|Stop recording
Слушаем… Сервис браузера может обрабатывать аудио через интернет.|Тыңдап тұрмыз… Браузер қызметі аудионы интернет арқылы өңдеуі мүмкін.|Listening… The browser service may process audio over the internet.
Текст добавлен. Проверьте распознавание перед расчётом.|Мәтін қосылды. Есептемес бұрын тану нәтижесін тексеріңіз.|Text added. Review the transcription before calculating.
Микрофон недоступен. Введите текст вручную.|Микрофон қолжетімсіз. Мәтінді қолмен енгізіңіз.|Microphone unavailable. Enter text manually.
Найдите свою команду|Өз командаңызды табыңыз|Find your team
Бригады и специалисты под ваш ремонт, площадь и бюджет.|Жөндеуіңізге, ауданыңызға және бюджетіңізге сай бригадалар мен мамандар.|Teams and specialists for your renovation, area and budget.
Сначала люди, затем ремонт|Алдымен адамдар, содан кейін жөндеу|People first, renovation next
Ваш ремонт начинается|Жөндеуіңізді|Your renovation starts
с правильного исполнителя.|дұрыс орындаушыдан бастаңыз.|with the right professional.
Сравните опыт, портфолио и расценки. Запросите смету, прежде чем создавать проект.|Тәжірибе, портфолио және бағаларды салыстырыңыз. Жоба жасамас бұрын смета сұраңыз.|Compare experience, portfolios and rates. Request an estimate before creating a project.
01 Выберите|01 Таңдаңыз|01 Choose
02 Согласуйте смету|02 Сметаны келісіңіз|02 Agree on an estimate
03 Ведите проект|03 Жобаны жүргізіңіз|03 Manage your project
Поиск|Іздеу|Search
Название или специализация|Атауы немесе мамандануы|Name or specialty
Город|Қала|City
Исполнитель|Орындаушы|Professional
Класс ремонта|Жөндеу класы|Renovation class
Работы|Жұмыстар|Services
До, ₸ / м²|Ең көбі, ₸ / м²|Up to, ₸ / m²
Например, 30000|Мысалы, 30000|For example, 30000
Например, 78|Мысалы, 78|For example, 78
Сортировка|Сұрыптау|Sort by
По опыту|Тәжірибе бойынша|Experience
Сначала дешевле|Алдымен арзанырақ|Lowest price
По рейтингу|Рейтинг бойынша|Rating
Найти|Іздеу|Search
Все|Барлығы|All
Бригада|Бригада|Team
Специалист|Маман|Specialist
Эконом|Эконом|Economy
Стандарт|Стандарт|Standard
Премиум|Премиум|Premium
Ремонт под ключ|Толық жөндеу|Turnkey renovation
Электрика|Электр жұмыстары|Electrical work
Отделка стен|Қабырғаларды әрлеу|Wall finishing
Плитка и санузлы|Плитка және жуыну бөлмелері|Tiling and bathrooms
Расценки ориентировочные, за м² выбранного вида работ. Сравнивайте исполнителей одной специализации: электромонтаж и ремонт под ключ имеют разный состав. Итоговую смету подрядчик готовит по вашей заявке.|Бағалар таңдалған жұмыс түрінің м² үшін шамамен берілген. Бір мамандықтағы орындаушыларды салыстырыңыз: электр жұмыстары мен толық жөндеудің құрамы әртүрлі. Соңғы сметаны мердігер өтініміңіз бойынша дайындайды.|Rates are indicative per m² of the selected service. Compare professionals within the same specialty: electrical work and turnkey renovation have different scopes. The contractor prepares the final estimate from your request.
Найдено:|Табылды:|Results:
Демо-профили и отзывы помечены в карточке исполнителя|Демо профильдер мен пікірлер орындаушы карточкасында белгіленген|Demo profiles and reviews are labelled on the professional’s profile
Подходящих исполнителей нет. Измените фильтры.|Сәйкес орындаушылар жоқ. Сүзгілерді өзгертіңіз.|No matching professionals. Adjust the filters.
лет опыта|жыл тәжірибе|years of experience
отзывов|пікір|reviews
по проектам|жобалар бойынша|from projects
Ориентир для|Бағдарлы баға|Indicative rate for
Профиль|Профиль|Profile
Профиль исполнителя|Орындаушы профилі|Professional profile
К каталогу|Каталогқа оралу|Back to catalog
Выбрать и запросить смету|Таңдап, смета сұрау|Choose and request an estimate
Демонстрационный профиль. Портфолио показано иллюстрациями, исходные отзывы — тестовые примеры.|Демо профиль. Портфолиода иллюстрациялар берілген, бастапқы пікірлер — тест мысалдары.|Demo profile. The portfolio uses illustrations and the initial reviews are sample entries.
Портфолио|Портфолио|Portfolio
Добавить работу|Жұмыс қосу|Add portfolio item
Исполнитель ещё не добавил работы.|Орындаушы жұмыстарын әлі қоспаған.|This professional has not added portfolio items yet.
Отзывы и оценки|Пікірлер мен бағалар|Reviews and ratings
Демо-отзыв|Демо пікір|Sample review
По завершённому проекту|Аяқталған жоба бойынша|From a completed project
Отзывы появятся после завершённых проектов.|Пікірлер жобалар аяқталғаннан кейін пайда болады.|Reviews will appear after completed projects.
Об исполнителе|Орындаушы туралы|About the professional
Ориентир:|Бағдарлы баға:|Indicative rate:
Финальная стоимость — в предложении.|Соңғы құны ұсыныста көрсетіледі.|The final price is in the proposal.
Опыт|Тәжірибе|Experience
лет|жыл|years
Объём объекта|Нысан ауданы|Project area
Запросить предложение|Ұсыныс сұрау|Request a proposal
После выбора отправьте заявку. Подрядчик подготовит базовую смету. Проект создаётся только после того, как вы примете предложение.|Таңдаған соң өтінім жіберіңіз. Мердігер бастапқы сметаны дайындайды. Жоба ұсынысты қабылдағаннан кейін ғана жасалады.|Send a request after choosing. The contractor prepares an initial estimate. A project is created only after you accept the proposal.
Выберите исполнителя и согласуйте первоначальную смету.|Орындаушыны таңдап, алғашқы сметаны келісіңіз.|Choose a professional and agree on the initial estimate.
Получайте заявки и готовьте предложения заказчикам.|Өтінімдерді алып, тапсырыс берушілерге ұсыныстар дайындаңыз.|Receive requests and prepare client proposals.
Бюджет заказчика|Тапсырыс беруші бюджеті|Client budget
Предложение подрядчика|Мердігер ұсынысы|Contractor proposal
Подготовить первоначальную смету|Алғашқы сметаны дайындау|Prepare initial estimate
Принять и создать проект|Қабылдап, жоба жасау|Accept and create project
Отклонить заявку|Өтінімді қабылдамау|Decline request
Открыть проект|Жобаны ашу|Open project
История заявки|Өтінім тарихы|Request history
Заявок пока нет. Выберите исполнителя в каталоге.|Өтінімдер әлі жоқ. Каталогтан орындаушыны таңдаңыз.|No requests yet. Choose a professional from the catalog.
Демо: открыть кабинет этого исполнителя|Демо: осы орындаушының кабинетін ашу|Demo: open this professional’s workspace
Расскажите о своём опыте, расценках и специализации.|Тәжірибеңіз, бағаларыңыз және мамандануыңыз туралы айтыңыз.|Tell clients about your experience, rates and specialty.
Создать профиль|Профиль жасау|Create profile
После заполнения профиль появится в каталоге. Новые отзывы смогут оставить заказчики завершённых проектов.|Толтырылған соң профиль каталогта пайда болады. Жаңа пікірлерді аяқталған жобалардың тапсырыс берушілері қалдыра алады.|Your profile appears in the catalog after completion. Clients can leave new reviews after completed projects.
Название бригады или имя|Бригада атауы немесе аты-жөні|Team name or your name
Тип|Түрі|Type
Специализация|Мамандануы|Specialty
Опыт, лет|Тәжірибе, жыл|Experience, years
Ориентир цены, ₸ / м²|Бағдарлы баға, ₸ / м²|Indicative price, ₸ / m²
От, м²|Ең азы, м²|From, m²
До, м²|Ең көбі, м²|Up to, m²
Классы ремонта|Жөндеу кластары|Renovation classes
О себе|Өзі туралы|About you
Публикация|Жариялау|Visibility
Показывать в каталоге|Каталогта көрсету|Show in catalog
Скрыть из каталога|Каталогтан жасыру|Hide from catalog
Сохранить профиль|Профильді сақтау|Save profile
Заявка|Өтінім|Request
Запрос не создаёт проект и не подтверждает итоговую цену. Сначала получите и проверьте предложение подрядчика.|Өтінім жоба жасамайды және соңғы бағаны бекітпейді. Алдымен мердігердің ұсынысын алып, тексеріңіз.|A request does not create a project or confirm the final price. First receive and review the contractor’s proposal.
Ремонт квартиры в ЖК Nova|Nova ТК пәтерін жөндеу|Apartment renovation at Nova
Адрес объекта|Нысан мекенжайы|Property address
Планируемый бюджет, ₸|Жоспарланған бюджет, ₸|Target budget, ₸
Что требуется сделать|Қандай жұмыс қажет|What work is needed
Тип помещения, объём работ, пожелания к отделке и срокам|Үй-жай түрі, жұмыс көлемі, әрлеу мен мерзімдерге тілектер|Property type, work scope, finishing preferences and timeline
Отправить заявку|Өтінім жіберу|Send request
Укажите состав и стоимость работ. После принятия заказчиком эта смета станет базовым бюджетом проекта.|Жұмыс құрамы мен құнын көрсетіңіз. Тапсырыс беруші қабылдаған соң осы смета жобаның бастапқы бюджеті болады.|Specify the work scope and cost. Once the client accepts, this estimate becomes the project’s initial budget.
Цена, ₸|Баға, ₸|Price, ₸
Комментарий и условия|Түсініктеме мен шарттар|Comments and terms
Что включено, какие материалы и этапы учтены|Не кіреді, қандай материалдар мен кезеңдер ескерілген|What is included, materials and stages covered
Отправить предложение|Ұсыныс жіберу|Send proposal
Проект отмечен завершённым.|Жоба аяқталды деп белгіленді.|Project marked as completed.
Ваш отзыв опубликован.|Пікіріңіз жарияланды.|Your review has been published.
Оставить отзыв об исполнителе|Орындаушы туралы пікір қалдыру|Review the professional
После окончания ремонта и согласования всех смет:|Жөндеу аяқталып, барлық смета келісілгеннен кейін:|After renovation and approval of all estimates:
Завершить проект|Жобаны аяқтау|Complete project
Работа в портфолио|Портфолиодағы жұмыс|Portfolio item
Название|Атауы|Title
Описание|Сипаттамасы|Description
Фото работы (необязательно)|Жұмыс фотосы (міндетті емес)|Project photo (optional)
PNG, JPEG, WebP до 400 КБ.|PNG, JPEG, WebP, 400 КБ дейін.|PNG, JPEG or WebP, up to 400 KB.
Иллюстрация|Иллюстрация|Illustration
Иллюстрация проекта|Жоба иллюстрациясы|Project illustration
Зелёный интерьер|Жасыл интерьер|Green interior
Тёплый интерьер|Жылы интерьер|Warm interior
Терракота|Терракота|Terracotta
Синий интерьер|Көк интерьер|Blue interior
Если фото не выбрано, используем иллюстрацию.|Фото таңдалмаса, иллюстрация қолданылады.|An illustration is used when no photo is selected.
Добавить работу|Жұмыс қосу|Add work item
Создать проект с этим исполнителем?|Осы орындаушымен жоба жасайсыз ба?|Create a project with this professional?
Принятая смета станет базовым бюджетом. Дополнительные работы будут согласовываться отдельно.|Қабылданған смета бастапқы бюджет болады. Қосымша жұмыстар бөлек келісіледі.|The accepted estimate becomes the initial budget. Additional work will be approved separately.
Причина|Себебі|Reason
Завершить проект?|Жобаны аяқтайсыз ба?|Complete project?
Подтвердите, что ремонт закончен. После завершения можно оставить один отзыв об исполнителе. Новые дополнительные сметы станут недоступны.|Жөндеудің аяқталғанын растаңыз. Аяқталғаннан кейін орындаушы туралы бір пікір қалдыруға болады. Жаңа қосымша сметалар жасау мүмкін болмайды.|Confirm that the renovation is finished. You can then leave one review. New additional estimates will no longer be available.
Подтвердить завершение|Аяқталуын растау|Confirm completion
Отзыв об исполнителе|Орындаушы туралы пікір|Professional review
Оценка|Баға|Rating
Ваш опыт|Сіздің тәжірибеңіз|Your experience
Опубликовать отзыв|Пікірді жариялау|Publish review
Ожидает предложения|Ұсынысты күтуде|Awaiting proposal
Предложение получено|Ұсыныс алынды|Proposal received
Проект создан|Жоба жасалды|Project created
От описания — к решению|Сипаттамадан шешімге дейін|From description to decision
Простой процесс, который сохраняет договорённости.|Келісімдерді сақтайтын қарапайым үдеріс.|A simple process that preserves agreements.
Подрядчик готовит смету|Мердігер сметаны дайындайды|Contractor prepares an estimate
Заказчик принимает решение|Тапсырыс беруші шешім қабылдайды|Client makes a decision
Бюджет обновляется|Бюджет жаңартылады|Budget updates
Проверьте работы, объёмы и цены. Утвердите, отклоните или запросите изменения с комментарием.|Жұмыстарды, көлемдерді және бағаларды тексеріңіз. Бекітіңіз, қабылдамаңыз немесе түсініктемемен өзгерістер сұраңыз.|Review work, quantities and prices. Approve, reject or request changes with a comment.
Только утверждённая смета увеличивает бюджет. Снимки версий и комментарии остаются в журнале.|Бюджетті тек бекітілген смета арттырады. Нұсқалар мен түсініктемелер журналда сақталады.|Only an approved estimate increases the budget. Version snapshots and comments remain in the journal.
Что означает AI в этой версии|Бұл нұсқада AI нені білдіреді|What AI means in this version
Загружаем RenoLock…|RenoLock жүктелуде…|Loading RenoLock…
Сохранено|Сақталды|Saved
Данные обновлены|Деректер жаңартылды|Data refreshed
Проект создан. Базовая смета зафиксирована.|Жоба жасалды. Бастапқы смета бекітілді.|Project created. Initial estimate fixed.
Прайс-лист сохранён|Бағалар тізімі сақталды|Price list saved
Черновик сохранён. Проверьте и отправьте заказчику.|Жоба нұсқасы сақталды. Тексеріп, тапсырыс берушіге жіберіңіз.|Draft saved. Review and send it to the client.
Позиции найдены в действующем прайсе|Позициялар ағымдағы прайстан табылды|Items found in the current catalog
Черновик подготовлен, нужны уточнения|Жоба нұсқасы дайын, нақтылау қажет|Draft prepared; clarification needed
Замечания отмечены как обработанные|Ескертулер өңделді деп белгіленді|Items marked as reviewed
Смета утверждена. Бюджет обновлён.|Смета бекітілді. Бюджет жаңартылды.|Estimate approved. Budget updated.
Смета отправлена заказчику|Смета тапсырыс берушіге жіберілді|Estimate sent to the client
Запрос на изменения сохранён|Өзгерістер сұрауы сақталды|Change request saved
Смета отклонена. Бюджет не изменился.|Смета қабылданбады. Бюджет өзгерген жоқ.|Estimate rejected. Budget unchanged.
Тестовые данные восстановлены|Тест деректері қалпына келтірілді|Sample data restored
Исполнитель выбран, проект и базовая смета созданы|Орындаушы таңдалды, жоба мен бастапқы смета жасалды|Professional selected; project and initial estimate created
Проект завершён. Теперь доступен отзыв.|Жоба аяқталды. Енді пікір қалдыруға болады.|Project completed. You can now leave a review.
Нет связи с сервером. Проверьте подключение и повторите действие.|Сервермен байланыс жоқ. Қосылымды тексеріп, қайталаңыз.|Cannot reach the server. Check your connection and try again.
Сервер вернул некорректный ответ|Сервер қате жауап берді|The server returned an invalid response
Ошибка запроса|Сұрау қатесі|Request failed
Проверьте текстовые поля|Мәтін өрістерін тексеріңіз|Check the text fields
Значение должно быть положительным числом|Мән оң сан болуы керек|The value must be a positive number
Доступно только подрядчику|Тек мердігерге қолжетімді|Contractors only
Доступно только заказчику|Тек тапсырыс берушіге қолжетімді|Clients only
Проект недоступен|Жоба қолжетімсіз|Project unavailable
Позиция прайса недоступна|Прайс позициясы қолжетімсіз|Catalog item unavailable
Позиция недоступна|Позиция қолжетімсіз|Item unavailable
Выберите единицу измерения|Өлшем бірлігін таңдаңыз|Select a unit of measure
Клиент должен сначала зарегистрироваться с этим email|Клиент алдымен осы email арқылы тіркелуі керек|The client must first register with this email
Добавьте начальную смету|Бастапқы сметаны қосыңыз|Add an initial estimate
Нет доступа|Қолжетімділік жоқ|Access denied
Смета не найдена|Смета табылмады|Estimate not found
Эту смету нельзя редактировать|Бұл сметаны өңдеуге болмайды|This estimate cannot be edited
Смета уже изменена — обновите страницу|Смета өзгертілген — бетті жаңартыңыз|The estimate has changed. Refresh the page
Смета не найдена|Смета табылмады|Estimate not found
Смета уже изменена|Смета өзгертілген|The estimate has changed
Проект завершён|Жоба аяқталған|Project completed
Сначала создайте проект|Алдымен жоба жасаңыз|Create a project first
Сначала добавьте активную позицию в прайс|Алдымен прайсқа белсенді позиция қосыңыз|Add an active catalog item first
Обработайте замечания к описанию и подтвердите проверку.|Сипаттамадағы ескертулерді өңдеп, тексеруді растаңыз.|Address the description issues and confirm your review.
Смета недоступна|Смета қолжетімсіз|Estimate unavailable
Смета уже изменена|Смета өзгертілген|Estimate has changed
Решение уже принято или смета изменена. Обновите страницу.|Шешім қабылданған немесе смета өзгерген. Бетті жаңартыңыз.|A decision has already been made or the estimate has changed. Refresh the page.
Недопустимое действие для этой роли или статуса|Бұл рөл немесе күй үшін әрекетке рұқсат жоқ|Action not allowed for this role or status
Пустую смету нельзя отправить|Бос сметаны жіберуге болмайды|An empty estimate cannot be submitted
Работа отсутствует в прайсе|Жұмыс прайста жоқ|Work item not found in the catalog
Неоднозначная работа — выберите позицию вручную|Жұмыс анық емес — позицияны қолмен таңдаңыз|Ambiguous work item. Select a catalog item manually
Некорректный объём|Көлемі дұрыс емес|Invalid quantity
Проверьте числовые значения|Сандық мәндерді тексеріңіз|Check the numeric values
Выберите класс ремонта|Жөндеу класын таңдаңыз|Select a renovation class
Выберите тип исполнителя|Орындаушы түрін таңдаңыз|Select a professional type
Максимальная площадь меньше минимальной|Ең үлкен аудан ең аз ауданнан кіші|Maximum area is less than minimum area
Сначала создайте профиль|Алдымен профиль жасаңыз|Create a profile first
Не более 12 работ|12 жұмыстан артық емес|Up to 12 portfolio items
Выберите оформление|Безендіруді таңдаңыз|Select a visual style
Некорректное изображение|Кескін дұрыс емес|Invalid image
Допускаются PNG, JPEG, WebP до 400 КБ|PNG, JPEG, WebP, 400 КБ дейін рұқсат етіледі|PNG, JPEG and WebP up to 400 KB are allowed
Фото должно быть не больше 400 КБ|Фото 400 КБ-тан аспауы керек|Photo must not exceed 400 KB
Не удалось прочитать фото|Фотосуретті оқу мүмкін болмады|Could not read the photo
Исполнитель недоступен|Орындаушы қолжетімсіз|Professional unavailable
Площадь не входит в диапазон исполнителя|Аудан орындаушы ауқымына кірмейді|Area is outside the professional’s range
Этот класс ремонта не предлагается|Бұл жөндеу класы ұсынылмайды|This renovation class is not offered
Заявка недоступна|Өтінім қолжетімсіз|Request unavailable
Заявка уже изменена. Обновите данные.|Өтінім өзгертілген. Деректерді жаңартыңыз.|The request has changed. Refresh the data.
Нельзя отправить предложение|Ұсынысты жіберу мүмкін емес|Cannot send a proposal
Добавьте от 1 до 100 строк сметы|Сметаға 1-ден 100-ге дейін жол қосыңыз|Add between 1 and 100 estimate lines
Добавьте от 1 до 100 позиций|1-ден 100-ге дейін позиция қосыңыз|Add between 1 and 100 items
Нет предложения для принятия|Қабылдайтын ұсыныс жоқ|No proposal available to accept
Заявка уже завершена|Өтінім аяқталған|This request is already closed
Проект уже завершён|Жоба аяқталған|Project already completed
Сначала завершите согласование всех дополнительных смет|Алдымен барлық қосымша сметаны келісуді аяқтаңыз|Complete approval of all additional estimates first
Отзыв доступен после завершения совместного проекта|Пікір бірлескен жоба аяқталғаннан кейін қолжетімді|Reviews are available after completing a shared project
Профиль исполнителя не найден|Орындаушы профилі табылмады|Professional profile not found
Отзыв на этот проект уже оставлен|Бұл жобаға пікір қалдырылған|A review has already been left for this project
Выберите целую оценку от 1 до 5|1-ден 5-ке дейін бүтін баға таңдаңыз|Choose a whole-number rating from 1 to 5
Неизвестное действие|Белгісіз әрекет|Unknown action
Войдите в аккаунт|Тіркелгіге кіріңіз|Sign in to your account
Неверный email или пароль|Email немесе құпиясөз қате|Incorrect email or password
Этот email уже зарегистрирован|Бұл email тіркелген|This email is already registered
Укажите имя, email, роль и пароль от 10 до 200 символов|Аты-жөніңізді, email, рөлді және 10–200 таңбалық құпиясөзді көрсетіңіз|Provide a name, email, role and a password of 10–200 characters
Слишком много попыток. Повторите через минуту.|Тым көп әрекет. Бір минуттан кейін қайталаңыз.|Too many attempts. Try again in a minute.
Ошибка сервера. Данные не изменены.|Сервер қатесі. Деректер өзгертілген жоқ.|Server error. Data was not changed.
Выберите CSV до 100 КБ|100 КБ дейінгі CSV таңдаңыз|Choose a CSV file up to 100 KB
Неверный заголовок CSV|CSV тақырыбы қате|Invalid CSV header
За один импорт можно добавить до 100 позиций|Бір импортта 100 позицияға дейін қосуға болады|Up to 100 items can be added per import
Добавлено позиций:|Қосылған позициялар:|Items added:
Проверьте строку|Жолды тексеріңіз|Check row
Строка|Жол|Row
ожидается 4 поля без кавычек и «;» внутри|тырнақшасыз және ішінде «;» жоқ 4 өріс күтіледі|expected 4 fields without quotes or internal semicolons
Импортировано|Импортталды|Imported
из|ішінен|of
Объём работы|Жұмыс көлемі|Work quantity
Цена работы|Жұмыс бағасы|Work price
Удалить позицию|Позицияны жою|Remove item
Работа базовой сметы|Бастапқы смета жұмысы|Initial estimate work item
Выравнивание стен|Қабырғаларды тегістеу|Wall leveling
Грунтовка стен|Қабырғаларды астарлау|Wall priming
Покраска стен|Қабырғаларды бояу|Wall painting
Установка розетки|Розетка орнату|Socket installation
Укладка плитки|Плитка төсеу|Tile installation
Прокладка кабеля|Кабель тарту|Cable installation
Черновые работы|Бастапқы құрылыс жұмыстары|Rough construction work
Чистовая отделка|Соңғы әрлеу|Finish work
Электрика и сантехника|Электр және сантехника жұмыстары|Electrical and plumbing work
Алматы|Алматы|Almaty
Астана|Астана|Astana
Валюта|Валюта|Currency
Смета|Смета|Estimate
м²|м²|m²
шт|дана|pcs
этап|кезең|stage
от|бастап|from
Загрузка|Жүктеу|Loading
Версия интерфейса|Интерфейс нұсқасы|Interface version
Язык|Тіл|Language
Тексты проектов и отзывы сохраняются на языке автора.|Жоба мәтіндері мен пікірлер автор тілінде сақталады.|Project text and reviews remain in the author’s language.
`;
export const translations={...Object.fromEntries((rows+mainRows).trim().split('\n').filter(Boolean).map(row=>{const [ru,kk,en]=row.split('|');if(!ru||!kk||!en)throw Error('Invalid translation row: '+row);return [ru,{kk,en}];})),...staffTranslations};
