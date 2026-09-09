insert into site_settings (site_name, site_description, operator_name, business_name, representative_name, media_registration_status, contact_email, contact_phone)
values ('생활경제저널', '생활경제, 지역상권, 교육, 시니어, 건강, 창업 현장의 브랜드와 사람을 기록하는 생활경제 전문 미디어입니다.', 'Algo Partners', '알고파트너스', '박예준', 'unregistered', 'contact@example.com', '000-0000-0000')
on conflict do nothing;

insert into categories (name, slug, description, sort_order) values
('생활경제', 'life-economy', '생활경제 현장과 소비 트렌드', 1),
('지역상권', 'local-business', '지역 상권과 생활서비스', 2),
('교육·학원', 'education', '교육기관과 학원 운영 현장', 3),
('시니어·요양', 'senior-care', '요양, 돌봄, 시니어 서비스', 4),
('건강·뷰티', 'health-beauty', '건강, 뷰티, 웰니스 서비스', 5),
('창업·프랜차이즈', 'startup-franchise', '창업과 프랜차이즈 정보', 6),
('브랜드 인터뷰', 'brand-interview', '브랜드와 대표자의 이야기', 7),
('오피니언', 'opinion', '편집부 칼럼과 전문가 기고', 8),
('보도자료', 'press-release', '기업, 기관, 단체 제공 자료', 9)
on conflict (slug) do nothing;

insert into products (name, slug, price, description, features, sort_order) values
('브랜드 인터뷰', 'brand-interview', 490000, '대표자 인터뷰 기사와 홍보용 링크를 제공하는 기본 상품입니다.', array['대표자 인터뷰 기사','업체 사진 반영','사이트 내 발행','홍보용 링크 제공'], 1),
('우수 브랜드 기획전', 'featured-brand-series', 890000, '브랜드 인터뷰와 기획전 노출, 블로그 재가공 원고를 포함합니다.', array['브랜드 인터뷰','기획전 섹션 노출','디지털 인증 이미지 문구','블로그 재가공 원고'], 2),
('프리미엄 광고 패키지', 'premium-ad-package', 1490000, '인터뷰, 배너, 카드뉴스 문구, 플레이스 소개문까지 포함한 패키지입니다.', array['인터뷰 기사','배너 광고 1개월','카드뉴스 문구','네이버 플레이스 소개문','상패/인증서 문구'], 3),
('월 광고주 패키지', 'monthly-advertiser', 390000, '월간 콘텐츠와 소식 문구를 제공하는 관리형 상품입니다.', array['월 1~2회 콘텐츠','배너 노출','이벤트/소식 문구','블로그/SNS 재가공 콘텐츠'], 4)
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '고물가 시대, 동네 소비가 달라지는 세 가지 흐름', 'life-economy-local-consumption-trends', '생활비 부담이 커지는 상황에서 소비자는 가격, 접근성, 신뢰도를 함께 따지고 있습니다.', $$고물가가 이어지면서 생활경제의 중심은 거창한 소비보다 매일 반복되는 선택으로 이동하고 있습니다.

지역 사업자에게 필요한 것은 단순 홍보보다 고객이 안심하고 비교할 수 있는 정보입니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '1 hour', array['생활경제','소비트렌드'] from categories where slug='life-economy'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '생활서비스 업종이 가격보다 먼저 설명해야 할 것', 'life-service-trust-points', '고객은 가격표보다 서비스 범위, 책임 기준, 상담 방식에서 신뢰를 확인합니다.', $$생활서비스 업종에서 가격은 중요한 판단 기준이지만 가격만으로 선택이 끝나지는 않습니다.

서비스 절차, 고객 응대 원칙, 사례 기반 설명이 포함되어야 합니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '2 hours', array['생활서비스','고객신뢰'] from categories where slug='life-economy'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '생활경제 현장에서 브랜드 콘텐츠가 필요한 이유', 'why-brand-content-matters-in-everyday-economy', '검색과 비교가 일상화되면서 업체의 설명력 자체가 경쟁력이 되고 있습니다.', $$소비자는 업체를 선택하기 전에 검색 결과, 지도 리뷰, 홈페이지, 블로그, 기사형 콘텐츠를 함께 확인합니다.

브랜드 콘텐츠는 광고 문구가 아니라 신뢰를 설명하는 자료가 되어야 합니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '3 hours', array['브랜드콘텐츠','생활경제'] from categories where slug='life-economy'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '동네 상권에서 오래가는 매장의 공통점', 'local-shops-long-run-factors', '오래가는 매장은 위치보다 고객 관계, 반복 품질, 지역 내 평판을 꾸준히 관리합니다.', $$지역 상권에서 오래 버티는 매장은 일정한 고객 응대, 서비스 품질의 안정성, 지역 평판 관리를 중요하게 봅니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '4 hours', array['지역상권','동네매장'] from categories where slug='local-business'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '지역 상권 홍보, 전단지보다 먼저 정리해야 할 기본 정보', 'local-business-basic-information', '업체명, 위치, 대표 서비스, 운영시간, 상담 채널 같은 기본 정보가 먼저 정리되어야 합니다.', $$지역 상권 홍보에서 가장 먼저 점검해야 할 것은 화려한 광고 문구가 아니라 기본 정보입니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '5 hours', array['지역홍보','상권마케팅'] from categories where slug='local-business'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '예약제 매장이 고객 이탈을 줄이는 상담 문구', 'reservation-shop-consulting-copy', '예약제 매장은 첫 문의 응대에서 절차, 시간, 준비사항을 명확히 안내해야 합니다.', $$예약제 매장은 첫 상담에서 고객의 불안을 줄이는 것이 중요합니다. 좋은 상담 문구는 고객이 다음 행동을 쉽게 결정하도록 돕습니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '6 hours', array['예약제매장','상담문구'] from categories where slug='local-business'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '학원 선택에서 학부모가 가장 먼저 보는 것은 무엇인가', 'education-choice-criteria', '학부모가 학원 선택 전 확인하는 신뢰 요소를 정리했습니다.', $$학부모는 학원 선택 전 강사진, 커리큘럼, 상담 방식, 후기, 운영 철학을 확인합니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '7 hours', array['학원','교육'] from categories where slug='education'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '교육기관 소개 콘텐츠에 반드시 들어가야 할 네 가지', 'education-content-four-points', '교육기관은 강사진, 커리큘럼, 관리 시스템, 상담 원칙을 균형 있게 보여줘야 합니다.', $$교육기관 소개 콘텐츠에는 강사진의 전문성, 커리큘럼의 흐름, 학생 관리 시스템, 학부모 상담 원칙이 포함되어야 합니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '8 hours', array['교육기관','커리큘럼'] from categories where slug='education'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '소규모 학원이 대형 학원과 다르게 보여줘야 할 강점', 'small-academy-brand-strengths', '소규모 학원은 밀착 관리, 빠른 피드백, 원장 철학을 구체적으로 보여줄 필요가 있습니다.', $$소규모 학원은 원장 직접 관리, 학생별 피드백, 학부모와의 빠른 소통을 강점으로 보여줄 수 있습니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '9 hours', array['소규모학원','교육마케팅'] from categories where slug='education'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '요양센터 선택 전 보호자가 확인해야 할 7가지 기준', 'senior-care-checklist', '요양센터 선택 전 보호자가 확인하면 좋은 기준을 정리했습니다.', $$요양센터를 선택할 때는 시설 환경, 상담 응대, 프로그램 구성, 보호자 소통 방식, 안전 관리 체계를 확인해야 합니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '10 hours', array['요양센터','시니어'] from categories where slug='senior-care'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '방문요양센터가 보호자에게 신뢰를 주는 설명 방식', 'home-care-trust-communication', '방문요양 상담에서는 서비스 범위, 요양보호사 매칭, 보고 방식이 핵심입니다.', $$방문요양센터는 보호자와 직접 대면하기 전 전화 상담에서 신뢰가 결정되는 경우가 많습니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '11 hours', array['방문요양','보호자상담'] from categories where slug='senior-care'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '주야간보호센터 홍보에서 프로그램 소개가 중요한 이유', 'day-care-center-program-content', '프로그램 구성은 센터의 운영 철학과 돌봄 품질을 보여주는 핵심 콘텐츠입니다.', $$주야간보호센터를 찾는 보호자는 하루 프로그램이 어떻게 구성되는지 궁금해합니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '12 hours', array['주야간보호센터','프로그램'] from categories where slug='senior-care'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '피부관리실이 고객 신뢰를 얻기 위해 준비해야 할 콘텐츠', 'skin-care-shop-trust-content', '뷰티 업종은 가격 이벤트보다 상담 기준, 위생 관리, 관리 절차 설명이 중요합니다.', $$피부관리실은 시술이나 관리 효과를 과장하기보다 상담 과정과 관리 절차를 정확히 설명해야 합니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '13 hours', array['피부관리실','뷰티'] from categories where slug='health-beauty'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '건강관리 서비스 홍보에서 피해야 할 과장 표현', 'health-service-risky-ad-copy', '건강 관련 서비스는 효과 보장, 최고 표현, 치료 오인 문구를 특히 주의해야 합니다.', $$건강관리 서비스는 고객 관심도가 높은 만큼 표현 리스크도 큽니다. 강한 표현보다 정확한 설명이 필요합니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '14 hours', array['건강관리','광고표현'] from categories where slug='health-beauty'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '뷰티샵 첫 방문 고객을 늘리는 소개문 구성법', 'beauty-shop-intro-copy-structure', '첫 방문 고객은 가격보다 위치, 예약, 상담, 관리 흐름을 먼저 확인합니다.', $$뷰티샵 소개문은 위치, 예약 방법, 첫 방문 상담, 관리 시간, 주차 여부, 준비사항을 먼저 담아야 합니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '15 hours', array['뷰티샵','소개문'] from categories where slug='health-beauty'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '창업 초기 브랜드가 온라인에서 신뢰를 쌓는 방법', 'startup-brand-online-trust', '초기 브랜드는 판매 문구보다 대표자 소개, 문제 해결 방식, 고객 사례를 먼저 정리해야 합니다.', $$창업 초기 브랜드는 인지도가 낮기 때문에 고객이 신뢰할 근거를 충분히 제공해야 합니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '16 hours', array['창업','브랜드'] from categories where slug='startup-franchise'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '프랜차이즈 가맹 상담 전 준비해야 할 콘텐츠', 'franchise-consulting-content', '가맹 상담에서는 수익보다 운영 구조, 교육, 지원 체계 설명이 중요합니다.', $$프랜차이즈 홍보에서 예비 창업자는 본사의 교육 체계, 운영 매뉴얼, 물류 지원, 마케팅 지원을 확인합니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '17 hours', array['프랜차이즈','가맹상담'] from categories where slug='startup-franchise'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '1인 창업자가 브랜드 소개 페이지를 먼저 만들어야 하는 이유', 'solo-founder-brand-page', '1인 창업자는 자신이 누구인지, 무엇을 해결하는지, 어떻게 일하는지를 분명히 보여줘야 합니다.', $$1인 창업자는 회사 규모보다 대표자의 전문성과 일하는 방식이 브랜드 신뢰의 핵심이 됩니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '18 hours', array['1인창업','브랜드소개'] from categories where slug='startup-franchise'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '브랜드 인터뷰: 지역에서 신뢰를 쌓아온 교육기관의 운영 철학', 'brand-interview-education-sample', '지역 교육기관의 운영 철학과 고객 신뢰 포인트를 담은 브랜드 인터뷰 샘플입니다.', $$본 콘텐츠는 브랜드 인터뷰 샘플입니다. 지역에서 오래 운영되는 교육기관의 운영 철학을 기사형 콘텐츠로 정리했습니다.$$, id, 'brand_interview', 'published', '편집부', true, '[브랜드 인터뷰 · 제휴 콘텐츠] 본 콘텐츠는 브랜드 인터뷰 샘플로 제작되었습니다.', now() - interval '19 hours', array['브랜드인터뷰','교육기관'] from categories where slug='brand-interview'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '브랜드 인터뷰: 보호자와의 소통을 중시하는 돌봄 서비스', 'brand-interview-care-communication', '돌봄 서비스에서 보호자 소통과 운영 투명성이 왜 중요한지 소개합니다.', $$본 콘텐츠는 브랜드 인터뷰 샘플입니다. 돌봄 서비스에서 보호자 소통과 운영 투명성이 중요한 이유를 소개합니다.$$, id, 'brand_interview', 'published', '편집부', true, '[브랜드 인터뷰 · 제휴 콘텐츠] 본 콘텐츠는 브랜드 인터뷰 샘플로 제작되었습니다.', now() - interval '20 hours', array['브랜드인터뷰','돌봄서비스'] from categories where slug='brand-interview'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '브랜드 인터뷰: 동네 매장이 단골을 만드는 방식', 'brand-interview-local-shop-regulars', '지역 매장이 단골 고객과 관계를 만들어가는 과정을 인터뷰 형식으로 정리했습니다.', $$본 콘텐츠는 브랜드 인터뷰 샘플입니다. 동네 매장의 고객 관계와 단골 형성 방식을 다룹니다.$$, id, 'brand_interview', 'published', '편집부', true, '[브랜드 인터뷰 · 제휴 콘텐츠] 본 콘텐츠는 브랜드 인터뷰 샘플로 제작되었습니다.', now() - interval '21 hours', array['브랜드인터뷰','지역상권'] from categories where slug='brand-interview'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '편집부 칼럼: 좋은 광고는 먼저 신뢰를 설명한다', 'opinion-good-advertising-explains-trust', '생활경제 업종에서 광고는 강한 문구보다 신뢰 형성 구조를 갖춰야 합니다.', $$생활경제 업종의 광고는 과장된 약속이 아니라 판단에 필요한 정보를 정리해주는 방식이어야 합니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '22 hours', array['오피니언','광고'] from categories where slug='opinion'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '편집부 칼럼: 생활경제 매체가 지역 브랜드를 다루는 방식', 'opinion-local-brand-media-role', '지역 브랜드 보도는 단순 소개를 넘어 소비자가 판단할 수 있는 정보를 제공해야 합니다.', $$생활경제 매체가 지역 브랜드를 소개할 때 가장 중요한 기준은 독자의 이해입니다.$$, id, 'normal', 'published', '편집부', false, null, now() - interval '23 hours', array['오피니언','지역브랜드'] from categories where slug='opinion'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '기고: 1인 사업자에게 필요한 온라인 신뢰 자산', 'opinion-solo-business-online-assets', '1인 사업자는 소개문, 인터뷰, 후기, 포트폴리오를 일관되게 정리해야 합니다.', $$1인 사업자에게 온라인 신뢰 자산은 선택이 아니라 기본 인프라입니다.$$, id, 'normal', 'published', '외부기고', false, null, now() - interval '24 hours', array['기고','1인사업자'] from categories where slug='opinion'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '알고파트너스, 생활경제 전문 매체 생활경제저널 운영 방향 공개', 'press-release-algo-partners-everyday-economy-journal', '알고파트너스는 생활경제저널을 통해 생활경제 현장과 브랜드 인터뷰 콘텐츠를 발행할 예정입니다.', $$알고파트너스는 생활경제 전문 미디어 생활경제저널의 운영 방향을 공개했다.$$, id, 'press_release', 'published', '편집부', false, null, now() - interval '25 hours', array['보도자료','알고파트너스'] from categories where slug='press-release'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select '생활경제저널, 브랜드 인터뷰 콘텐츠 운영 원칙 안내', 'press-release-brand-interview-policy', '생활경제저널은 브랜드 인터뷰와 제휴 콘텐츠의 표시 기준을 명확히 운영한다고 밝혔다.', $$생활경제저널은 브랜드 인터뷰와 제휴 콘텐츠 운영 원칙을 안내했다.$$, id, 'press_release', 'published', '편집부', false, null, now() - interval '26 hours', array['보도자료','브랜드인터뷰'] from categories where slug='press-release'
on conflict (slug) do nothing;

insert into articles (title, slug, summary, content, category_id, article_type, status, author_name, is_sponsored, sponsored_notice, published_at, tags)
select 'MediaOffice, 1인 매체 운영을 위한 관리자 시스템으로 기획', 'press-release-mediaoffice-admin-system', 'MediaOffice는 기사 발행, 리드 관리, 고객 관리, 콘텐츠 제작을 통합하는 내부 운영툴로 기획되었습니다.', $$MediaOffice는 1인 매체 운영자가 기사 발행과 광고 영업, 고객 관리, 콘텐츠 제작을 함께 처리할 수 있도록 기획된 관리자 시스템이다.$$, id, 'press_release', 'published', '편집부', false, null, now() - interval '27 hours', array['보도자료','MediaOffice'] from categories where slug='press-release'
on conflict (slug) do nothing;

insert into templates (title, type, content, variables) values
('브랜드 인터뷰 첫 안내문', 'email', '{{업체명}} 대표님, 안녕하세요. 생활경제저널 브랜드 인터뷰 담당자입니다. 대표님의 운영 철학과 서비스 강점을 인터뷰 콘텐츠로 소개하는 제휴 콘텐츠 상품을 안내드립니다.', array['업체명']),
('자료 요청문', 'email', '브랜드 인터뷰 제작을 위해 업체 소개, 대표자 사진, 서비스 사진, 주요 강점, 고객층 정보를 보내주세요.', array['업체명','대표자명']),
('납품 안내문', 'delivery', '기사 발행이 완료되었습니다. 기사 링크: {{기사링크}}', array['기사링크'])
on conflict do nothing;
