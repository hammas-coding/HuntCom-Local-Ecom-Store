import React from "react";
import { Carousel, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Wallpaper.module.css";
import WallpaperImage from "../../assets/wallpaper.jpg";

const Wallpaper = (props) => {
  const { title, content, button } = props;
  return (
    <Container fluid className="p-0">
      <Carousel controls={false} indicators={false}>
        <Carousel.Item>
          <img
            className={`d-block w-100 ${styles.fullHeight}`}
            src={WallpaperImage}
            alt="First slide"
          />
          <Carousel.Caption className={styles.carouselCaption}>
            <div className={styles.overlayBox}>
              <h2>{title ? title : "The Complete Shopping Store"}</h2>
              <p>
                {content
                  ? content
                  : "Here you can get every item with every variety of your choice. We cannot compromise one the quality of any product."}
              </p>
              <Button variant="success" className="mt-4">
                {button ? button : "Start your shopping"}
              </Button>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
};

export default Wallpaper;
