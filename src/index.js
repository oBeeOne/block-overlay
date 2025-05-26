import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
    InnerBlocks,
    MediaUpload,
    MediaUploadCheck
} from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    SelectControl,
    RangeControl,
    ColorPicker,
    Button
} from '@wordpress/components';

import '../editor.css';

const applyPreset = (preset, setAttributes) => {
    const presets = {
        'top-left': {
            top: '0',
            left: '0',
            right: 'auto',
            bottom: 'auto',
            transform: 'none'
        },
        'top-center': {
            top: '0',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translateX(-50%)'
        },
        'center': {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)'
        },
        'bottom-right': {
            top: 'auto',
            left: 'auto',
            right: '0',
            bottom: '0',
            transform: 'none'
        },
        'custom': {} // ne modifie rien
    };

    const values = presets[preset];
    if (values) {
        setAttributes({
            ...values,
            positionPreset: preset
        });
    }
};

registerBlockType('bicreactive/bloc-overlay', {
    edit({ attributes, setAttributes }) {
        const {
            position,
            top,
            right,
            bottom,
            left,
            zIndex,
            transform,
            positionPreset,
            backgroundType,
            backgroundColor,
            backgroundImage,
            backgroundVideo,
            width,
            height
        } = attributes;

        const style = {
            position,
            top,
            right,
            bottom,
            left,
            zIndex,
            transform,
            width,
            height
        };

        if (backgroundType === 'color') {
            style.backgroundColor = backgroundColor;
        } else if (backgroundType === 'image') {
            style.backgroundImage = `url(${backgroundImage})`;
            style.backgroundSize = 'cover';
            style.backgroundPosition = 'center';
        }

        const blockProps = useBlockProps({ style, className: 'bloc-overlay' });

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Positionnement')} initialOpen={true}>
                        <SelectControl
                            label={__('Position rapide')}
                            value={positionPreset}
                            options={[
                                { label: 'Personnalisée', value: 'custom' },
                                { label: 'Haut gauche', value: 'top-left' },
                                { label: 'Haut centre', value: 'top-center' },
                                { label: 'Centre', value: 'center' },
                                { label: 'Bas droite', value: 'bottom-right' }
                            ]}
                            onChange={(value) => applyPreset(value, setAttributes)}
                        />
                        <SelectControl
                            label={__('Type de position')}
                            value={position}
                            options={[
                                { label: 'Relative', value: 'relative' },
                                { label: 'Absolute', value: 'absolute' },
                                { label: 'Fixed', value: 'fixed' }
                            ]}
                            onChange={(value) => setAttributes({ position: value })}
                        />
                        <TextControl label="Top" value={top} onChange={(value) => setAttributes({ top: value })} />
                        <TextControl label="Right" value={right} onChange={(value) => setAttributes({ right: value })} />
                        <TextControl label="Bottom" value={bottom} onChange={(value) => setAttributes({ bottom: value })} />
                        <TextControl label="Left" value={left} onChange={(value) => setAttributes({ left: value })} />
                        <RangeControl
                            label="z-index"
                            value={zIndex}
                            onChange={(value) => setAttributes({ zIndex: value })}
                            min={0}
                            max={999}
                        />
                    </PanelBody>

                    <PanelBody title={__('Dimensions')} initialOpen={false}>
                        <TextControl
                            label="Largeur (width)"
                            value={width}
                            onChange={(value) => setAttributes({ width: value })}
                            help="ex: auto, 100%, 300px, 80vw"
                        />
                        <TextControl
                            label="Hauteur (height)"
                            value={height}
                            onChange={(value) => setAttributes({ height: value })}
                            help="ex: auto, 100vh, 500px"
                        />
                    </PanelBody>

                    <PanelBody title={__('Fond du bloc')} initialOpen={false}>
                        <SelectControl
                            label={__('Type de fond')}
                            value={backgroundType}
                            options={[
                                { label: 'Aucun', value: 'none' },
                                { label: 'Couleur', value: 'color' },
                                { label: 'Image', value: 'image' },
                                { label: 'Vidéo', value: 'video' }
                            ]}
                            onChange={(value) => setAttributes({ backgroundType: value })}
                        />

                        {backgroundType === 'color' && (
                            <ColorPicker
                                color={backgroundColor}
                                onChangeComplete={(value) => setAttributes({ backgroundColor: value.hex })}
                            />
                        )}

                        {backgroundType === 'image' && (
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={(media) => setAttributes({ backgroundImage: media.url })}
                                    allowedTypes={['image']}
                                    render={({ open }) => (
                                        <Button onClick={open} isSecondary>{__('Choisir une image')}</Button>
                                    )}
                                />
                            </MediaUploadCheck>
                        )}

                        {backgroundType === 'video' && (
                            <TextControl
                                label="URL de la vidéo (MP4 externe)"
                                value={backgroundVideo}
                                onChange={(value) => setAttributes({ backgroundVideo: value })}
                            />
                        )}
                    </PanelBody>
                </InspectorControls>
                <div {...blockProps}>
                    {backgroundType === 'video' && backgroundVideo && (
                        <video autoPlay muted loop playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}>
                            <source src={backgroundVideo} type="video/mp4" />
                        </video>
                    )}
                    <InnerBlocks />
                </div>
            </>
        );
    },

    save({ attributes }) {
        const {
            position,
            top,
            right,
            bottom,
            left,
            zIndex,
            transform,
            backgroundType,
            backgroundColor,
            backgroundImage,
            backgroundVideo,
            width,
            height
        } = attributes;

        const style = {
            position,
            top,
            right,
            bottom,
            left,
            zIndex,
            transform,
            width,
            height
        };

        if (backgroundType === 'color') {
            style.backgroundColor = backgroundColor;
        } else if (backgroundType === 'image') {
            style.backgroundImage = `url(${backgroundImage})`;
            style.backgroundSize = 'cover';
            style.backgroundPosition = 'center';
        }

        const blockProps = useBlockProps.save({ style, className: 'bloc-overlay' });

        return (
            <div {...blockProps}>
                {backgroundType === 'video' && backgroundVideo && (
                    <video autoPlay muted loop playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}>
                        <source src={backgroundVideo} type="video/mp4" />
                    </video>
                )}
                <InnerBlocks.Content />
            </div>
        );
    }
});
