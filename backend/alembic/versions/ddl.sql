CREATE TABLE company_profiles (
	id UUID NOT NULL, 
	legal_name VARCHAR(160) NOT NULL, 
	summary TEXT NOT NULL, 
	about TEXT NOT NULL, 
	signage_since_year INTEGER, 
	country VARCHAR(80) NOT NULL, 
	head_office_address TEXT NOT NULL, 
	factory_address TEXT NOT NULL, 
	phone_primary VARCHAR(40) NOT NULL, 
	phone_mobile VARCHAR(40) NOT NULL, 
	phone_secondary VARCHAR(40), 
	email_primary VARCHAR(255) NOT NULL, 
	email_careers VARCHAR(255) NOT NULL, 
	hours_weekday VARCHAR(160) NOT NULL, 
	hours_sunday VARCHAR(80) NOT NULL, 
	facebook_url VARCHAR(400), 
	map_factory_lat VARCHAR(40), 
	map_factory_lng VARCHAR(40), 
	map_factory_note TEXT, 
	seo_title VARCHAR(180) NOT NULL, 
	seo_description TEXT NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE company_values (
	id UUID NOT NULL, 
	title VARCHAR(120) NOT NULL, 
	description TEXT NOT NULL, 
	icon_key VARCHAR(40) NOT NULL, 
	sort_order INTEGER NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE divisions (
	id UUID NOT NULL, 
	slug VARCHAR(160) NOT NULL, 
	name VARCHAR(160) NOT NULL, 
	summary TEXT NOT NULL, 
	body TEXT NOT NULL, 
	hero_image VARCHAR(400), 
	hero_caption TEXT, 
	hero_is_company_photo BOOLEAN NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	show_in_navigation BOOLEAN NOT NULL, 
	sort_order INTEGER NOT NULL, 
	seo_title VARCHAR(180), 
	seo_description TEXT, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE highlights (
	id UUID NOT NULL, 
	group_key VARCHAR(40) NOT NULL, 
	title VARCHAR(180) NOT NULL, 
	summary TEXT NOT NULL, 
	href VARCHAR(240), 
	sort_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE industries (
	id UUID NOT NULL, 
	slug VARCHAR(160) NOT NULL, 
	name VARCHAR(160) NOT NULL, 
	summary TEXT NOT NULL, 
	body TEXT NOT NULL, 
	image VARCHAR(400), 
	image_caption TEXT, 
	image_is_company_photo BOOLEAN NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	sort_order INTEGER NOT NULL, 
	seo_title VARCHAR(180), 
	seo_description TEXT, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE inquiries (
	id UUID NOT NULL, 
	full_name VARCHAR(160) NOT NULL, 
	company VARCHAR(180) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	phone VARCHAR(40) NOT NULL, 
	country VARCHAR(80) NOT NULL, 
	category VARCHAR(80) NOT NULL, 
	subject VARCHAR(200) NOT NULL, 
	message TEXT NOT NULL, 
	attachment_path VARCHAR(400), 
	status VARCHAR(40) NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE jobs (
	id UUID NOT NULL, 
	slug VARCHAR(180) NOT NULL, 
	title VARCHAR(180) NOT NULL, 
	department VARCHAR(120) NOT NULL, 
	location VARCHAR(160) NOT NULL, 
	description TEXT NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	seo_title VARCHAR(180), 
	seo_description TEXT, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE media_assets (
	id UUID NOT NULL, 
	filename VARCHAR(240) NOT NULL, 
	url VARCHAR(400) NOT NULL, 
	alt VARCHAR(240) NOT NULL, 
	mime_type VARCHAR(80) NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE organizations (
	id UUID NOT NULL, 
	name VARCHAR(200) NOT NULL, 
	kind VARCHAR(40) NOT NULL, 
	logo_url VARCHAR(400), 
	notes TEXT, 
	sort_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE product_categories (
	id UUID NOT NULL, 
	slug VARCHAR(160) NOT NULL, 
	name VARCHAR(160) NOT NULL, 
	description TEXT NOT NULL, 
	sort_order INTEGER NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE resources (
	id UUID NOT NULL, 
	slug VARCHAR(180) NOT NULL, 
	title VARCHAR(200) NOT NULL, 
	summary TEXT NOT NULL, 
	body TEXT NOT NULL, 
	category VARCHAR(80) NOT NULL, 
	file_url VARCHAR(400), 
	is_active BOOLEAN NOT NULL, 
	sort_order INTEGER NOT NULL, 
	seo_title VARCHAR(180), 
	seo_description TEXT, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE site_settings (
	key VARCHAR(80) NOT NULL, 
	value TEXT NOT NULL, 
	PRIMARY KEY (key)
);

CREATE TABLE statistics (
	id UUID NOT NULL, 
	label VARCHAR(180) NOT NULL, 
	value VARCHAR(80) NOT NULL, 
	source_note TEXT NOT NULL, 
	is_verified BOOLEAN NOT NULL, 
	is_public BOOLEAN NOT NULL, 
	sort_order INTEGER NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE users (
	id UUID NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	full_name VARCHAR(160) NOT NULL, 
	password_hash VARCHAR(255) NOT NULL, 
	role VARCHAR(40) NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);

CREATE TABLE applications (
	id UUID NOT NULL, 
	job_id UUID, 
	full_name VARCHAR(160) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	phone VARCHAR(40) NOT NULL, 
	message TEXT NOT NULL, 
	cv_path VARCHAR(400), 
	status VARCHAR(40) NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(job_id) REFERENCES jobs (id)
);

CREATE TABLE division_offerings (
	id UUID NOT NULL, 
	division_id UUID NOT NULL, 
	title VARCHAR(180) NOT NULL, 
	description TEXT NOT NULL, 
	sort_order INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(division_id) REFERENCES divisions (id) ON DELETE CASCADE
);

CREATE TABLE products (
	id UUID NOT NULL, 
	slug VARCHAR(180) NOT NULL, 
	name VARCHAR(180) NOT NULL, 
	summary TEXT NOT NULL, 
	description TEXT NOT NULL, 
	category_id UUID NOT NULL, 
	division_id UUID, 
	hero_image VARCHAR(400), 
	hero_caption TEXT, 
	hero_is_company_photo BOOLEAN NOT NULL, 
	verification_note TEXT, 
	is_active BOOLEAN NOT NULL, 
	is_featured BOOLEAN NOT NULL, 
	sort_order INTEGER NOT NULL, 
	seo_title VARCHAR(180), 
	seo_description TEXT, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(category_id) REFERENCES product_categories (id), 
	FOREIGN KEY(division_id) REFERENCES divisions (id)
);

CREATE TABLE projects (
	id UUID NOT NULL, 
	slug VARCHAR(180) NOT NULL, 
	title VARCHAR(200) NOT NULL, 
	summary TEXT NOT NULL, 
	description TEXT NOT NULL, 
	division_id UUID, 
	client_name VARCHAR(200), 
	location VARCHAR(240), 
	is_featured BOOLEAN NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	sort_order INTEGER NOT NULL, 
	seo_title VARCHAR(180), 
	seo_description TEXT, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(division_id) REFERENCES divisions (id)
);

CREATE TABLE product_documents (
	id UUID NOT NULL, 
	product_id UUID NOT NULL, 
	title VARCHAR(180) NOT NULL, 
	file_url VARCHAR(400) NOT NULL, 
	sort_order INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE product_specs (
	id UUID NOT NULL, 
	product_id UUID NOT NULL, 
	label VARCHAR(120) NOT NULL, 
	value VARCHAR(240) NOT NULL, 
	sort_order INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE project_images (
	id UUID NOT NULL, 
	project_id UUID NOT NULL, 
	url VARCHAR(400) NOT NULL, 
	alt VARCHAR(240) NOT NULL, 
	is_company_photo BOOLEAN NOT NULL, 
	sort_order INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(project_id) REFERENCES projects (id) ON DELETE CASCADE
);

CREATE TABLE project_products (
	project_id UUID NOT NULL, 
	product_id UUID NOT NULL, 
	PRIMARY KEY (project_id, product_id), 
	FOREIGN KEY(project_id) REFERENCES projects (id) ON DELETE CASCADE, 
	FOREIGN KEY(product_id) REFERENCES products (id) ON DELETE CASCADE
);



CREATE INDEX ix_divisions_is_active ON divisions (is_active);

CREATE UNIQUE INDEX ix_divisions_slug ON divisions (slug);

CREATE INDEX ix_highlights_group_key ON highlights (group_key);

CREATE UNIQUE INDEX ix_industries_slug ON industries (slug);

CREATE INDEX ix_inquiries_status ON inquiries (status);

CREATE INDEX ix_inquiries_email ON inquiries (email);

CREATE INDEX ix_inquiries_category ON inquiries (category);

CREATE UNIQUE INDEX ix_jobs_slug ON jobs (slug);

CREATE INDEX ix_organizations_kind ON organizations (kind);

CREATE UNIQUE INDEX ix_product_categories_slug ON product_categories (slug);

CREATE UNIQUE INDEX ix_resources_slug ON resources (slug);

CREATE INDEX ix_resources_category ON resources (category);

CREATE UNIQUE INDEX ix_users_email ON users (email);

CREATE INDEX ix_division_offerings_division_id ON division_offerings (division_id);

CREATE INDEX ix_products_is_active ON products (is_active);

CREATE INDEX ix_products_division_id ON products (division_id);

CREATE INDEX ix_products_category_id ON products (category_id);

CREATE UNIQUE INDEX ix_products_slug ON products (slug);

CREATE INDEX ix_projects_division_id ON projects (division_id);

CREATE UNIQUE INDEX ix_projects_slug ON projects (slug);

CREATE INDEX ix_projects_is_active ON projects (is_active);

CREATE INDEX ix_product_documents_product_id ON product_documents (product_id);

CREATE INDEX ix_product_specs_product_id ON product_specs (product_id);

CREATE INDEX ix_project_images_project_id ON project_images (project_id);
