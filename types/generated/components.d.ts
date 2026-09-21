import type { Schema, Struct } from '@strapi/strapi';

export interface AddressAddress extends Struct.ComponentSchema {
  collectionName: 'components_address_addresses';
  info: {
    displayName: 'Address';
  };
  attributes: {
    Building: Schema.Attribute.String & Schema.Attribute.Required;
    district: Schema.Attribute.String;
    pin: Schema.Attribute.String;
    place: Schema.Attribute.String & Schema.Attribute.Required;
    state: Schema.Attribute.String;
  };
}

export interface FeatureService extends Struct.ComponentSchema {
  collectionName: 'components_feature_services';
  info: {
    displayName: 'service';
  };
  attributes: {};
}

export interface FooterSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    displayName: 'Social Link';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['github', 'twitter', 'linkedin', 'instagram', 'facebook', 'youtube']
    >;
    URL: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFeature extends Struct.ComponentSchema {
  collectionName: 'components_shared_features';
  info: {
    displayName: 'Feature';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTag extends Struct.ComponentSchema {
  collectionName: 'components_shared_tags';
  info: {
    displayName: 'Tag';
  };
  attributes: {
    tagName: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'address.address': AddressAddress;
      'feature.service': FeatureService;
      'footer.social-link': FooterSocialLink;
      'shared.feature': SharedFeature;
      'shared.seo': SharedSeo;
      'shared.tag': SharedTag;
    }
  }
}
