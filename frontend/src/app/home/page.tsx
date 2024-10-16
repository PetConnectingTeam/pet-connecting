"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Paper, Stack, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

interface Service {
  PublisherId: number;
  ServiceId: number;
  address: string;
  completed: boolean;
  cost: string;
  description: string;
  petId: number;
  publishDate: string;
  serviceDateEnd: string;
  serviceDateIni: string;
  takerId: number | null;
}

const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const imageBase64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQA2gMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAACBQEGB//EADYQAAICAQMCBQIFBAEDBQAAAAECAAMRBBIhMUEFEyJRYTJxBhQjgZFCobHwUmJy8TNjgsHR/8QAGQEAAwEBAQAAAAAAAAAAAAAAAQIDAAQF/8QAJBEAAgICAwACAgMBAAAAAAAAAAECEQMhEjFBBBMiUTJCgXH/2gAMAwEAAhEDEQA/APOLCrBiEWcRBsIJcCUWEHWYBdVhNsqphFgMdVZcCcEuJjHcSwE4BLAYmMTE7iSQGAx0CTE6DJmYxQicKyxIkBmswIichCJXE1gBMJQwxEGwmswIyhEKRKGazAyIMiFMG0NhBsJRoRpQwhQJhKQhlMTBGFWXVZZVhVWYzRRUhgk6ohQswKBqnMKqzoEuomAVCy6rLgQipAYoFlgsKEltohDQDZJsMZCyKvJmo1ABWZ3ySY0FnSJqNQk1PuJXyyI7jInAmTgdfYQUahTYZw1nHSblHguquUMQlYP/ACPMMfw+4Hq1NYP/AGmNwYVBnmmQ+0Gaz7T0lngVoBNdiP8AHTMzb9O9D7LUKk9MiK4tB4GUajKmkx9sdoNsQG4oSahvaUNJ7xtjzKFsdeYTUhNqTBtURHd49pUspgth4oznrI7SmJoPtgsL7Q2zcSyniWVouLeJxWy0wrY8h5h8j2iQPAl1s9UILHEx7QmB7RXdjmWFhIms1jSdYZRE63MOrmY10N002WnCIzf9ozNCjwrJB1Nhrz/SBzF6/EfyWnStBl7MnPzM9vFDvatrDZfn6Vgc0jpx4b2z040WhRNoUH/qZuYI+D02c6e4A+x5nnqtbfvJKl1B5GY14H45p9ba6C9E1CMcVE9RAslvoq8Kob1Wgs0w3MQVzjIihOTNa3UC4WVWthGHB9pjWApaykk4OOYzkmcuSDgGVQcDvNbSKmgr3WbTaeRkdJkaawIxsdsKgzjHUxF9e9+rdrLDwMIvbHvA8iSK4MXPbN4+OjzrUdgSgi7eI6izc6+mocZJxmYegp8y20qcOz8n2EZ1ngZ8SrK6y+1K16bH2r/EylKSLNRRr6fVi2sWVWbgTztOcRrVqus0likhmQZVh/SZn+CafReC6MoNzUgHLOcmIP8AizwI+Ik16m2tz+mQV9DcjBPz/wDspG6JySaF244g3aH1tTU3Ojdj1ibydnIyFhmVLCD5zzIwM1gRxyIMniRpQmaxrITKTjGD3GE1lACYVUIlKzzGARtgsWiwBxIn1zquMYkyAZmYZxkS4UAQCP7wwOYAFl64hgvaLq/q+0vqHX8vYxPRT0mDFWxbTaka/UXKjYFZwvzGfAfDtPobtTrNbaQpblrW5HzPJ+H6xtNrlZR16gTY8cvGs8HWurAU9R7nMFflR6XUaR62vxTwjVv5emtqc9AB1/aTTeG6TRa3zaxTU1nLHb9U+X+AXrovE0tYjjIz3nuNd49S2jXSUPu1doyu3+hfcxpxp6Am6Nf8Q6jT/krBWxW4JlSnEzfDdadfpEdzm5Btc+/sZgeJ333aX/1GJRcE5jP4R1S/nLKbDw1XH7RF+w5IJwcWegsVmpZF69Z53UPqNJ4iBqUatip2gjrPZeGaYajV+oHYvqY/EB+KtPVrWBIIKngjriNKCqyPxsjSrwwtPrcPYaz9RycmS78R06fVCvU2ckcbuQJnlDp7to5XMU8Z0JssXV0KHIG1lPQiLBq6Zaavod8Z/EVVq7U1AII4C95g+F6fT6rxPTX2B/JNw3sEO3IPSMaHQU6+kLUArp1U9QM/3npNV4Vaul0mn0rJVWF3up4O49Zd/gtCOP7NfxvUV33C2sgq3UjvMnOTDiseWtZbdtGM+8EVwcCSs4p96B2DnEh4XmdJHecswVhFQszDoINjiEICmVbBgGVAHYYzzB7x7GGsK4xKYEOw0ioyBjHMKqsVmhdp6HLlDhh/E5VpiVPGD2+ZJZItWPP48oumKV6e1lyBmWWpiduDkTU0w8skMMAw1CVG8lcfMR5qY6+PasyNj4wBLCqwDrN8aSvfuC5zAarRkP8ApqYYZlIGT4soKzKpRweekMdMbVZDnDqRxG00zgYZP3jlGjY4I6SjlGtMnHFLl0eT0v4W12lD6jUvT6QdqqSSf7cTP1NLWnyGU7i2az7N7T6Y1a16ds85GBPF+IhatTvA4Uwq9NnoQd6YnpPBqLPEiX2hTnH35i5D6NS5Ui647eR0Ucf3jQ312izcNoOYvqLn1Wr85+vb4ErOWiksdHpvwd4fVqdQF1a71IORNTU/hfSeBFrtHWvqyN5JJA9pk/h3WflrRuOD/kT3i3J4lovLfByREx01Xpz578Mvw0rp9Az2DBt/vMvX2cnI4zNbxu8Daq42V8DEw73rs9J5z7xp9UThHijD1yrtLE4PaZS3212Daf6uhHE2dVo2dSeWVTkZ6zLfSEls7uORkYMikXXQ3V4E2psXUaJ0qfqSOMH2nqL/AA27SeEUvc4tfd6n9pmfhyt69iXuAg9+89lePzXh19QXI2/3l8a12Ryt1R4vPMocZzGzorAxJ+n4i16hCR8SCkn6c0sco9i7jL/EGc5xGMpszBhkx/8AcZMShO04aD8znpNR9HS9e4NziZbJhiB2iwyKTaHnjlCmy4pa0blHEr5DQlN7AFKxOZ1H/GDnK2Nwi0mhpQQ+WOYyWLksDhQIjTz1sH3zDoTWRufIz0HOZNxXh0RlLvwN6mQZ5A6RygeWod1b1doCjVZ3fpkgc8CFo1FbPgu4HUqecyMpeNHXiw3ck7Cm8JypMtXq2fG8faU1NCEKaj6T1J7SzVou0eeNgHWZKKjoRvNKfQ5p9SqVuWE6moyQMgAjvEbrdNptOEZydxwHxnmV0C3ai5KDyDwTjoIsMbl0Nlnw7WzS1du2kEHcJ5LXPvdi6nrPT+KBKs18bVGBPLaq2lmKhTn7ztkqpEoftiZpBYFeBjpALUwbnt7xyuxQMZ49zKlq/Kc5598Q7Hew2jsZbFCsTjr7T1Ph/ip09XLfaeHGpCHah9Q7/EbXWNhFz1bEWmnaC6aPWXarzc46mLN05gNJ+pkk84hbA4TG0D/qcx9+kGDcN9VeMgZI7EQKurrYpTawXn/ftAaq67TVm3cHz2X2ndJqULA+4AcH7f6P2mMP6Sz9QFQZ6fSagtprM9kP+J4bQPcruF5KPgA9Tnme18IPn6NqrFYM6kfaPC9iy7TMdGfThhawas8qRB2BLh6UDDHeV1W5XNVhAKtzj/E699IRVpcBuhnBTiros5LJJrwq1SBF9I2n2gL9NSx/TG2ct82qncr+YhyMqehhNOS9QRlG0r395Rz4qyax820lQBFrpySMn5iuopLuzAYB7CMKhqZlsDFs9SJZ2Whw2ck88xVPdoyxqUFYtXWlGdy+rHWc/MLOW3vc7uVwT/EW/wDiY3FPbDGco6Qao0Fd2GVQcAd8yoQeduRz5fyOYvVaqc6isIAe55jWmtpt09rqhOeMbsDEztPRZY1xYwxdDkEop756w9JrWroTYejHqJTS2foc1rtA9IXtL3V1JYr7sqy5w56fxJz29IONfWm77CjzLOK2BJH0noDIabVXdYBgHkZlBbUVUmsIMf8AEhTC1W11cK24MwJPXEEV7Q053KuQOk+cqrtcNn6SOs3PDKjpUZnKnccrg9JmfmiDsdSzPlAx42jENQWpVa2JJAJGT0l8Mk5EcmKUVt3Yt45YbHcrznvPM20tv3AZm9rz6CMnJ7zLchamy3OI/cgpVEx31GH2Tl1pGnwD9Z/iJWuPOJb3nLbwalA6gy/EnyNGjThl3d529PICOTwGzGNEc0LjvEPFbCjsmcgciItsp/U9L4Xqc8+6zY04rtPqGT8zxngmuA9DNgkYyZ6jR27WGDM9Mj2U/E9fkUU2ImUZgCPb5nm01BR29zwJ7L8RKbfBbWHVQDmeFWtrWwW6mM16BGl4bqLBbjPG7Jnu/CLgqAknH3nz/Sjy8oT6hPYeA37giNggiaLpmktHfHFpTX2G04RsNwO5mZaiedleQBkEcTX8fSiy0ixiGRB6R1MyLNqphVCYHUnmQnNcmb6ZNI7dpjp6y/mLliCUzK1ubLVRHUWL/QT9UDfe2Gt5PuOoMR0mqevUtc65cjqR2/3iQ249HWvj1K5yo0Xa57myzALxt+IDzrCpqYqCvUkQi+I33KBtVlcdGPT+IuFRiMkgjI4mtpbQsccOdykcQvu3FgU7Ad5fzrP+AnEFVYVydwzwO4hNxP8AT/eZvZVrl/wybWU1Izp6wcEE9veXpZlwcDGeMDiDTdnB9Ub0jVoqodOtmCASxPH2nVSSOB5JZHTYLV32eUwV8cekD/PEul5eqv6jYV9Qxkk+0Yv2LSQdOdhIww4MCumQ59bME6DGIqp+DTTS43YfT2Xflx5qFickHJ/x2nKb2bbtGCCAQ3tKlLHJ3ZA6gA9DLmpxWxyodTn1DOe3WKlRssvsrVDVGuUK5usJU88fUBnGIRPEKrtVUtFdxCjl2z0yf5ia0qhT9MFfcEnOfeMUWDTZ+pRyAN3H3jVXQscm6fRfW6onI2YHbImHrrRWjbm9TdpuEtdnd9PVQWHX3it+ipsv8x/VUAAV7n3mg/WVlNVUTymm051msNRcIdhK57sBwPiKDT6g8vVYoDYIK+095d4fonDanT0tXY3BBOcDIOf7TqC1Sqs7DHTaBjHaU+7d+CSVJJ9mF4fTqDpxtrs3Ae0R8YotDjerK549QxPe3JqNHpi9d9RwMlQB1mTqK21X6rVtvA3N3HxIwzOU9LRXLUIb7PF1UW1VrYGJQjIbPfP/AJnrPDtW7IjdSwA/eVu0lYKVMuF7be33l9PVfUv6dQYg7lA795ecuSOWMz0KsdXotRTauQazx+08PoAy2LkHcDyD1x/uZ62vV3pQqmrGU9Weuff/AH3iJ0ObFYVIfMyzc9vmLzio7Htt0kZ+qGb1etcdN49pr+FagU6ivaSQ0X1VC1ehSGG0eoHkygJo2soHpGRgc8wXe0BSfKmafjFq261iucuFOMd8TPtA4DDqMA44Ih9ff+bVLyNu4AYA5GO8SbzGJwx+fcQ1eyUpNMJWlZPFeectzyD7wTKidACOgJnPN55zuYCVyfSzc4zj26xIR4+lM2ZZKpUFXUHTq2whR0b0jmCa3fu3kfcYBJg3zwLCMHr7iDd0QYI2qfnBPtHJxsrbwwCvzjc2O0H5o92/mEYqTt5wesm+kceWx+f9M3+DJX2y67titUm4g8n4hUchtvTnJI6zg1C+WgT0ke0HfyxdGOO5xEU23sdwSSaZqLaMqSxIbhgTxErwFudWbC5IBx2galLkOX46YjL0rsCli2eYqgosrkyvLHqqIrWFHJHB4zOqXC5PQdD1JnM+UwQnPyZd/MVSm4YJzkCahE7VNl6/MQAAZB5EJvHlqtmHIfJ+JdL0FqAIoAIPEo2+x2CgKCxOTDG2LNRT7LeZpy7cfV0I7GQuAxOMY4BP+9IM01s2Xcj329Mw9hXyiq1KTj6ieTBJ0GEU+w1bbt1YsULtwuRgGAsasNkV7ApAwOcy9daLUvmWIrd8mdtpRdrLYWDfPUyMZQbotkjkSUmlSBLa5c3H1HPTHB+Zw3irUWIteEbq3vmMJYu5K2rHcEEy1tFKerzV5Ayvz95VKMdIlKby/kxQ6hFB9B4OPnEut1Ruw5sG4fUOit2g7FUKHAG7OFwfedt2hvQo7R3G0QUq2FusFiKtZyUP6jKMBjBAuLvqAYAcZ4xJwUCIAVJBIHaUup2E1+YS7YAOOQIvGlRRy5OzjDzLCSyqPqwP8TuRgIpYsxIB9vgzrVeTX6Ed2HUY4lSma81steecg95oyT0hpYWlzkEYowC8cc/tF2Vi+Gx045+n95EsKvgnjGCfaWwrLwxx1EqrohpsWyGH/EjglhI4CqWsUkfA6QpsrckKQCOo95WxgDtUn7npAtjfjHs7UunqYDU4Jb6QDB66nRDbcjhQGAfdzj7QXpNdj1oxY8Dvj3izWDJzjcPjvJ/W+V8i/wBuPjXEffT6N1JRirAdSYj5X/uL/Ms+MqNh46mD3IP6P7ysItdsjklGTuKovXxk+3SM2amz8uE9IH2kkk32dUYrgwCMygAEwjWvuU7jxOyR2cl9hM7m3HrGlYmk5x0kkiSK4umVRBY+GJ+ntOr6RkE5BkkjJsi+g1SgjJHzLI26rJ6jMkk3gfUAprF1jGwlue5jW0WXpWeFGBgSSTmSXM7Ms5OKTYXWVLW7BcjnEFagFX7SSTofZykRA6c+3aAXhj8EjmSSCT2LFKgtqCvTi1OGLQdLsdTShOQWwcySTf1YzX5xQ7ZqrRc6hsBenEztZg37sDJkknPg/mej82KWJUDdAbUyT6uss6BUYDPHIkklW3ZyYop43aEWGVDHrI5Plr/iSSWicvoZLn2oucBmycd4G1y1vqxwcdJJIqWysv4kX6mXtAnGegkklEL4f//Z";
  const mymetype = "image/png";


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get("http://127.0.0.1:5001/services", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        });
        console.log("Datos recibidos:", response.data);
        if (Array.isArray(response.data)) {
          setServices(response.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Container>
        {loading ? (
          <CircularProgress />
        ) : (
          <Stack
            spacing={5}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginLeft: "-300px", // Ajusta este valor según tus necesidades
              "& > :not(style)": {
                m: 1,
                width: { xs: 300, sm: 500, md: 700 },
                height: { xs: 200, sm: 250, md: 300 },
              },
            }}
          >
            {services.length === 0 ? (
              <Typography variant="h6">No se encontraron servicios.</Typography>
            ) : (
              services.map((service) => (
               /* <Paper
                  key={service.ServiceId}
                  elevation={5} // Ajusta la sombra para que se vea más destacado
                  sx={{
                    alignSelf: "flex-sart", // Mueve el componente a la derecha
                    //margin: 10, // Agrega espacio alrededor para que no esté pegado a otros elementos
                    //padding: 10 , // Agrega espacio interno para que el contenido no esté pegado a los bordes
                    width: { xs: "90%", sm: "80%", md: "70%" }, // Ajusta el ancho para diferentes tamaños de pantalla
                    backgroundColor: "#f9f9f9", // Fondo suave para mejorar la estética
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra suave para darle profundidad
                  }}
                >*/
                <Box
                  sx={{
                    alignSelf: "center", // Mueve el componente a la derecha
                    display: "flex", // Permite que los elementos se alineen horizontalmente
                    alignItems: "flex-start", // Alinea los elementos en la parte superior
                    justifyContent: "space-between", // Espacia los elementos
                    margin: 100, // Agrega espacio alrededor para que no esté pegado a otros elementos
                    padding: 2, // Ajusta el padding interno
                    bgcolor: "#ffffff", // Fondo blanco para el post
                    borderRadius: 2, // Bordes redondeados
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Sombra suave
                    marginBottom: 2, // Espacio inferior entre posts
                    border: "1px solid #e1e8ed", // Borde sutil
                  }}
                >
                  <Box sx={{ flex: 1 }}> {/* Esta Box contendrá los textos */}
                    <Typography variant="h6" sx={{ color: "#657786", fontWeight: 'bold' }}>
                      Description: {service.description}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#657786" }}>
                      Direction: {service.address}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#657786", fontWeight: 'bold' }}>
                      Cost: {service.cost} Points
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#657786" }}>
                      Services date: {new Date(service.serviceDateIni).toLocaleString()} -{" "}
                      {new Date(service.serviceDateEnd).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#657786" }}>
                      Publish on: {new Date(service.publishDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#657786" }}>
                      ID of the pet: {service.petId} {/* Muestra el petId aquí */}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: service.completed ? "green" : "red" }}>
                      {service.completed ? "Completado" : "Pendiente"}
                    </Typography>
                  </Box>
                  <Box sx={{ marginLeft: 2 }}> {/* Esta Box contendrá la imagen */}
                    <Typography variant="h6" sx={{ color: "#657786" }}>Photos</Typography>
                    <img
                      src={`data:${mymetype};base64,${imageBase64}`}
                      alt="Captured"
                      style={{
                        maxWidth: "150px", // Ajusta el tamaño máximo de la imagen
                        height: "auto", // Mantiene la relación de aspecto
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </Box>
                </Box>


                //</Paper>
              ))
              
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
